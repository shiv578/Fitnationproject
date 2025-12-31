const express = require("express");
const router = express.Router();
const UserStreak = require("../models/UserStreak");
const { getTaskForDay } = require("../utils/streakTasks");

// YYYY-MM-DD (local)
const todayStr = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

/**
 * 🔥 GET TODAY'S TASK (AUTO CREATE)
 */
router.get("/today/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const date = todayStr();

    let record = await UserStreak.findOne({ userId, date });
    if (record) {
      return res.json({ success: true, challenge: record });
    }

    const start = new Date("2025-01-01");
    const today = new Date(date);
    const dayIndex = Math.floor((today - start) / (1000 * 60 * 60 * 24));

    const task = getTaskForDay(dayIndex);

    record = await UserStreak.create({
      userId,
      date,
      taskText: task.text,
      level: task.level
    });

    res.json({ success: true, challenge: record });
  } catch (err) {
    console.error("TODAY CHALLENGE ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * ✅ COMPLETE TODAY'S TASK
 */
router.post("/complete", async (req, res) => {
  try {
    const { userId } = req.body;
    const date = todayStr();

    const record = await UserStreak.findOne({ userId, date });

    if (!record) {
      return res.status(404).json({ success: false });
    }

    if (record.completed) {
      return res.status(400).json({
        success: false,
        message: "Already completed. Next task at 12 AM."
      });
    }

    record.completed = true;
    await record.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/**
 * 📊 GET LAST 365 DAYS (GREEN DOT DATA)
 */
router.get("/streak/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const end = new Date();
    end.setMinutes(end.getMinutes() - end.getTimezoneOffset());

    const start = new Date(end);
    start.setDate(start.getDate() - 364);

    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);

    const records = await UserStreak.find({
      userId,
      date: { $gte: startStr, $lte: endStr }
    }).lean();

    const map = {};
    records.forEach(r => (map[r.date] = r.completed));

    const days = [];
    for (let i = 0; i < 365; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const ds = d.toISOString().slice(0, 10);

      days.push({
        date: ds,
        completed: map[ds] || false
      });
    }

    res.json({ success: true, days });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

module.exports = router;
