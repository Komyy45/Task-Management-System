const mongoose = require("mongoose");

const Task = mongoose.model(
  "Task",
  new mongoose.Schema({
    title: String,
    description: String,
    dueDate: Date,
    priority: String,
    completed: Boolean,
    category: String,
    progress: Number,
    status: String,
    userEmail: String,
  })
);

module.exports = Task;
