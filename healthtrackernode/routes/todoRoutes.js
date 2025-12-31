const express = require("express");
const DailyTodo = require("../models/DailyTodo");

const router = express.Router();

/* SAVE OR UPDATE TODO FOR A DATE */
router.post("/todo/save", async (req, res) => {
  try {
    const { userId, date, todos } = req.body;

    const completedCount = todos.filter(t => t.done).length;
    const totalCount = todos.length;
    const completionPercent =
      totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    const record = await DailyTodo.findOneAndUpdate(
      { userId, date },
      {
        todos,
        completedCount,
        totalCount,
        completionPercent
      },
      { upsert: true, new: true }
    );

    // --- REVERT: Do not trigger streak update from todo completion ---

    res.json({ success: true, record });
  } catch (err) {
    console.error("SAVE TODO ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* GET TODAY TODO */
router.get("/todo/today/:userId", async (req, res) => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const todayStr = today.toISOString().slice(0, 10);

  const data = await DailyTodo.findOne({
    userId: req.params.userId,
    date: todayStr
  });

  res.json(data || { todos: [], completionPercent: 0 });
});

/* LAST 7 DAYS */
router.get("/todo/week/:userId", async (req, res) => {
  const data = await DailyTodo.find({ userId: req.params.userId })
    .sort({ date: -1 })
    .limit(7);

  res.json(data.reverse());
});

/* LAST 30 DAYS */
router.get("/todo/month/:userId", async (req, res) => {
  const data = await DailyTodo.find({ userId: req.params.userId })
    .sort({ date: -1 })
    .limit(30);

  res.json(data.reverse());
});

/* AUTO ROLLOVER AT NEW DAY */
router.post("/todo/auto-rollover", async (req, res) => {
  try {
    const { userId } = req.body;

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    // Check if today already exists
    const todayRecord = await DailyTodo.findOne({
      userId,
      date: todayStr
    });

    if (todayRecord) {
      return res.json({ success: true, message: "Already rolled over" });
    }

    // Find yesterday record
    const yesterdayRecord = await DailyTodo.findOne({
      userId,
      date: yesterdayStr
    });

    // If yesterday exists, keep it (already saved)
    // Create fresh empty todo for today
await DailyTodo.updateOne(
  { userId, date: todayStr },
  {
    $setOnInsert: {
      todos: [],
      completedCount: 0,
      totalCount: 0,
      completionPercent: 0
    }
  },
  { upsert: true }
);


    res.json({ success: true, message: "New day initialized" });
  } catch (err) {
    console.error("AUTO ROLLOVER ERROR:", err);
    res.status(500).json({ success: false });
  }
});
/* GET TODO BY DATE */
router.post("/todo/by-date", async (req, res) => {
  try {
    const { userId, date } = req.body;

    const record = await DailyTodo.findOne({ userId, date });

    res.json(record);
  } catch (err) {
    console.error("FETCH BY DATE ERROR:", err);
    res.status(500).json(null);
  }
});



module.exports = router;
