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

/* GET TODAY'S CHALLENGE */
router.get("/today/:userId", async (req, res) => {
  const { userId } = req.params;
  const date = todayStr();

  let record = await UserStreak.findOne({ userId, date }); 
  if (record) {
    return res.json({ success: true, challenge: record });
  }

  const start = new Date("2025-01-01");
  const today = new Date(date);
  const dayIndex = Math.floor((today - start) / 86400000);

  const task = getTaskForDay(dayIndex);

  record = await UserStreak.create({
    userId,
    date,
    taskText: task.text,
    level: task.level
  });

  res.json({ success: true, challenge: record });
});

/* COMPLETE TODAY'S CHALLENGE */
router.post("/complete", async (req, res) => {
  const { userId } = req.body;
  const date = todayStr();

  const record = await UserStreak.findOne({ userId, date });
  if (!record) return res.status(404).json({ success: false });

  if (record.completed) {
    return res.json({
      success: false,
      message: "Already completed"
    });
  }

  record.completed = true;
  await record.save();

  res.json({ success: true });
});

/* GET STREAK DATA (365 DAYS) */
router.get("/streak/:userId", async (req, res) => {
  const { userId } = req.params;

  const end = new Date();
  end.setMinutes(end.getMinutes() - end.getTimezoneOffset());

  const start = new Date(end);
  start.setDate(start.getDate() - 364);

  const records = await UserStreak.find({
    userId,
    date: {
      $gte: start.toISOString().slice(0, 10),
        $lte: end.toISOString().slice(0, 10)
    }
  }).lean();

      const map = {};
          records.forEach(r => (map[r.date] = r.completed));

     const days = [];
     for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const ds = d.toISOString().slice(0, 10);
    days.push({ date: ds, completed: map[ds] || false });
  }

  res.json({ success: true, days });
});

module.exports = router;
