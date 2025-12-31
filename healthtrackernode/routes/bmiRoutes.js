const express = require("express");
const BMIHistory = require("../models/BMIHistory");
const { getBMICategory } = require("../utils/bmiCategory");

const router = express.Router();

/**
 * SAVE BMI
 */
router.post("/bmi/save", async (req, res) => {
  try {
    const { userId, bmi } = req.body;

    if (!userId || !bmi) {
      return res.status(400).json({
        success: false,
        message: "userId and bmi are required"
      });
    }

    const category = getBMICategory(bmi);

    const record = await BMIHistory.create({
      userId,
      bmi,
      category
    });

    res.json({
      success: true,
      record
    });
  } catch (error) {
    console.error("BMI SAVE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save BMI"
    });
  }
});

/**
 * GET BMI HISTORY
 */
router.get("/bmi/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await BMIHistory
      .find({ userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error("BMI HISTORY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch BMI history"
    });
  }
});
/**
 * DELETE BMI HISTORY (ALL)
 */
router.delete("/bmi/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    await BMIHistory.deleteMany({ userId });

    res.json({
      success: true,
      message: "BMI history deleted"
    });
  } catch (error) {
    console.error("BMI DELETE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete BMI history"
    });
  }
});


module.exports = router;
