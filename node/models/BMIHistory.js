const mongoose = require("mongoose");

const bmiHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  bmi: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ["Underweight", "Fit", "Overweight", "Obese"],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("BMIHistory", bmiHistorySchema);
