const mongoose = require("mongoose");

const UserStreakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true
    },
    taskText: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// ✅ ONE TASK PER USER PER DAY (ANTI-CHEAT)
UserStreakSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("UserStreak", UserStreakSchema);
