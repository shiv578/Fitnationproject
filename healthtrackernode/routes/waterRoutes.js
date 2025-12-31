const express = require("express");
const WaterHistory = require("../models/WaterHistory");
const DailyTodo = require("../models/DailyTodo");

const router = express.Router();

/**
 * 🔄 CLEANUP OLD WATER DATA (KEEP LAST 30 DAYS)
 */
const cleanupOldWaterData = async (userId) => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  await WaterHistory.deleteMany({
    userId,
    date: { $lt: cutoffStr }
  });
};

/**
 * 🎯 SET DAILY WATER GOAL (LOCK GOAL)
 */
router.post("/water/set-goal", async (req, res) => {
  try {
    const { userId, date, goalLiters } = req.body;

    if (!userId || !date || !goalLiters) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const record = await WaterHistory.findOneAndUpdate(
      { userId, date },
      {
        $setOnInsert: {
          userId,
          date,
          totalDrankMl: 0,
          completionPercent: 0
        },
        $set: {
          goalLiters,
          goalLocked: true
        }
      },
      { upsert: true, new: true }
    );

    await cleanupOldWaterData(userId);

    res.json({ success: true, record });
  } catch (err) {
    console.error("SET WATER GOAL ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * 💧 UPDATE WATER DRINK (GLASS CLICKS)
 */
router.post("/water/update", async (req, res) => {
  try {
    const { userId, date, totalDrankMl } = req.body;

    if (!userId || !date) {
      return res.status(400).json({ success: false });
    }

    const record = await WaterHistory.findOne({ userId, date });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Water goal not set"
      });
    }

    if (!record.goalLocked) {
      return res.status(400).json({
        success: false,
        message: "Goal not locked"
      });
    }

    const percent = Math.min(
      100,
      Math.round((totalDrankMl / (record.goalLiters * 1000)) * 100)
    );

    record.totalDrankMl = totalDrankMl;
    record.completionPercent = percent;

    await record.save();

    // Check and update streak
    let streakData = {};
    try {
      streakData = await updateWaterStreak(userId, req.body.date);
    } catch (streakErr) {
      console.error("Streak update error (non-blocking):", streakErr);
    }

    res.json({ success: true, record, streak: streakData });
  } catch (err) {
    console.error("WATER UPDATE ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * � UPDATE WATER STREAK LOGIC
 */
const updateWaterStreak = async (userId, date) => {
  // Get today's record
  const today = new Date(date);
  const yesterdayDate = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = yesterdayDate.toISOString().slice(0, 10);

  const todayRecord = await WaterHistory.findOne({ userId, date });
  const yesterdayRecord = await WaterHistory.findOne({ userId, date: yesterdayStr });

  let newStreak = 0;

  // Check if today's goal is completed (>= 100%) AND all todos are done
  let todosDone = false;
  const todayTodo = await DailyTodo.findOne({ userId, date });
  if (todayTodo && todayTodo.completionPercent === 100) {
    todosDone = true;
  }

  if (todayRecord?.completionPercent >= 100 && todosDone) {
    // If yesterday was also completed (water+todo), increment streak
    let yesterdayTodosDone = false;
    if (yesterdayRecord?.completionPercent >= 100) {
      const yesterdayTodo = await DailyTodo.findOne({ userId, date: yesterdayStr });
      if (yesterdayTodo && yesterdayTodo.completionPercent === 100) {
        yesterdayTodosDone = true;
      }
    }
    if (yesterdayTodosDone) {
      newStreak = (yesterdayRecord.currentStreak || 1) + 1;
    } else {
      newStreak = 1;
    }
  } else {
    newStreak = 0;
  }

  // Update today's record with new streak
  if (todayRecord) {
    todayRecord.currentStreak = newStreak;
    await todayRecord.save();
  }

  // Update user's overall streak
  const user = await User.findById(userId);
  const currentLongest = user?.waterStreak?.longestStreak || 0;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      "waterStreak.currentStreak": newStreak,
      "waterStreak.lastCompletionDate": date,
      "waterStreak.longestStreak": Math.max(newStreak, currentLongest)
    },
    { new: true }
  );

  return {
    currentStreak: newStreak,
    longestStreak: updatedUser.waterStreak.longestStreak,
    lastCompletionDate: date
  };
};

/**
 * �📊 GET WATER HISTORY (LAST 30 DAYS)
 */
router.get("/water/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await cleanupOldWaterData(userId);

    const history = await WaterHistory.find({ userId })
      .sort({ date: -1 })
      .limit(30);

    res.json({ success: true, history });
  } catch (err) {
    console.error("WATER HISTORY ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * 🗑 DELETE TODAY WATER GOAL (RESET)
 */
router.delete("/water/reset/:userId/:date", async (req, res) => {
  try {
    const { userId, date } = req.params;

    await WaterHistory.deleteOne({ userId, date });

    res.json({ success: true });
  } catch (err) {
    console.error("WATER RESET ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * 🏅 GET STREAK INFO
 */
router.get("/water/streak/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const User = require("../models/users");

    const user = await User.findById(userId).select("waterStreak");
    res.json({
      success: true,
      streak: user?.waterStreak || {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletionDate: null
      }
    });
  } catch (err) {
    console.error("GET STREAK ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/**
 * Force streak update (for frontend trigger)
 */
router.post("/water/force-streak-update", async (req, res) => {
  try {
    const { userId, date } = req.body;
    if (!userId || !date) return res.status(400).json({ success: false, message: "Missing userId or date" });
    const result = await updateWaterStreak(userId, date);
    res.json({ success: true, streak: result });
  } catch (err) {
    console.error("FORCE STREAK UPDATE ERROR:", err);
    res.status(500).json({ success: false });
  }
});

// For direct import in todoRoutes
module.exports.updateWaterStreak = updateWaterStreak;

module.exports = router;
