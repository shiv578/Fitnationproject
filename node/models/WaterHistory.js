const mongoose = require("mongoose");

const waterHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  date: {
    type: String, // YYYY-MM-DD
    required: true
  },

  goalLiters: {
    type: Number,
    required: true,
    max: 5
  },

  totalDrankMl: {
    type: Number,
    default: 0
  },

  completionPercent: {
    type: Number,
    default: 0
  },

  goalLocked: {
    type: Boolean,
    default: false
  },

  currentStreak: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("WaterHistory", waterHistorySchema);
