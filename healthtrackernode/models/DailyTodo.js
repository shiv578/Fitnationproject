const mongoose = require("mongoose");

const TodoItemSchema = new mongoose.Schema({
  label: String,
  target: String,
  done: Boolean,
  locked: {
    type: Boolean,
    default: false
  }
});


const DailyTodoSchema = new mongoose.Schema(
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
    todos: [TodoItemSchema],
    completedCount: Number,
    totalCount: Number,
    completionPercent: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyTodo", DailyTodoSchema);
