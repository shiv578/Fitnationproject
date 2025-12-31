const express = require("express");
const router = express.Router();
const { Types } = require("mongoose");

const Streak = require("../models/Streak");        // your existing streak model
const UserStreak = require("../models/UserStreak"); // ✅ daily streak (heatmap)
const { getRandomTask } = require("../utils/streakTasks");

// helper → YYYY-MM-DD (local)
const todayStr = (d = new Date()) =>
  new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

/**
 * 🔹 ASSIGN RANDOM DAILY TASK (testing/demo)
 */
router.get("/assign-random/:userId", async (req, res) => {
  const { userId } = req.params;
  const label = getRandomTask();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 60 * 1000);

  let streak = await Streak.findOne({ userId });
  if (!streak) {
    streak = new Streak({
      userId,
      currentStreak: 0,
      maxStreak: 0,
      tasks: []
    });
  }

  const activeTask = streak.tasks.find(
    t => !t.completed && t.expiresAt > now
  );

  if (activeTask) {
    return res.json({
      message: "Active task already assigned",
      task: activeTask
    });
  }

  const task = { label, assignedAt: now, expiresAt };
  streak.tasks.push(task);
  await streak.save();

  res.json({ message: "Random task assigned", task });
});

/**
 * 🔹 ASSIGN DAILY TASK (production)
 */
router.post("/assign", async (req, res) => {
  const { userId, label } = req.body;
  if (!userId || !label)
    return res.status(400).json({ error: "userId and label required" });

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 60 * 1000);

  let streak = await Streak.findOne({ userId });
  if (!streak) {
    streak = new Streak({
      userId,
      currentStreak: 0,
      maxStreak: 0,
      tasks: []
    });
  }

  const activeTask = streak.tasks.find(
    t => !t.completed && t.expiresAt > now
  );

  if (activeTask) {
    return res.json({
      message: "Active task already assigned",
      task: activeTask
    });
  }

  const task = { label, assignedAt: now, expiresAt };
  streak.tasks.push(task);
  await streak.save();

  res.json({ message: "Task assigned", task });
});

/**
 * 🔹 COMPLETE DAILY TASK
 * - updates number streak
 * - saves daily completion for heatmap
 */
router.post("/complete", async (req, res) => {
  const { userId } = req.body;
  const now = new Date();

  let streak = await Streak.findOne({ userId });
  if (!streak)
    return res.status(404).json({ error: "No streak found" });

  const task = streak.tasks.find(
    t => !t.completed && t.expiresAt > now
  );

  if (!task)
    return res.status(400).json({ error: "No active task to complete" });

  // ✅ mark task complete
  task.completed = true;
  task.completedAt = now;

  // 🔢 update streak numbers
  streak.lastCompleted = now;
  streak.currentStreak += 1;
  if (streak.currentStreak > streak.maxStreak) {
    streak.maxStreak = streak.currentStreak;
  }

  await streak.save();

  // 🔥 SAVE DAILY STREAK (FOR GREEN DOTS)
  const date = todayStr(now);

  await UserStreak.findOneAndUpdate(
    { userId, date },
    { completed: true },
    { upsert: true, new: true }
  );

  res.json({
    message: "Task completed",
    streak
  });
});

/**
 * 🔥 GET LAST 30 DAYS STREAK (FOR HEATMAP)
 */
router.get("/challenge/streak/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const dates = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      dates.push(d.toISOString().slice(0, 10));
    }

    const records = await UserStreak.find({
      userId,
      date: { $in: dates }
    });

    const map = {};
    records.forEach(r => {
      map[r.date] = r.completed;
    });

    const streak = dates.map(date => ({
      date,
      completed: map[date] || false
    }));

    res.json({ success: true, streak });
  } catch (err) {
    console.error("STREAK FETCH ERROR:", err);
    res.status(500).json({ success: false });
  }
});


module.exports = router;
