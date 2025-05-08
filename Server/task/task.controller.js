const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/task.model");
const jwt = require("jsonwebtoken");
const router = express.Router();

async function GetCategories(email) {
  const categories = new Map();
  const tasks = await Task.find({ userEmail: email });

  tasks.forEach((task) => {
    const val = categories.get(task.category);
    const category = task.category;
    if (val) categories.set(category, val + 1);
    else categories.set(category, 1);
  });

  const response = {};

  categories.forEach((value, key) => {
    response[key] = value;
  });

  return response;
}

router.get("/categories", async (req, res) => {
  const email = getUserEmail(req);
  const tasksCountPerCategory = await GetCategories(email);

  res.status(200).json(tasksCountPerCategory);
});

router.get("/stats", async (req, res) => {
  const email = getUserEmail(req);
  const tasksStats = await Task.find({ userEmail: email }).select(
    "_id status dueDate progress"
  );

  return res.status(200).json(tasksStats);
});

router.get("/summary", async (req, res) => {
  const email = getUserEmail(req);
  const tasksStats = await Task.find({ userEmail: email }).select(
    "_id status dueDate progress"
  );
  const tasksCountPerCategory = await GetCategories(email);

  return res
    .status(200)
    .json({ tasks: tasksStats, categories: tasksCountPerCategory });
});

/*
  GET: /api/task?category=c&pageSize=s&pageIndex=i
*/
router.get("/", async (req, res) => {
  const email = getUserEmail(req);

  const { category, pageSize, pageIndex, search, priority } = req.query;

  let tasks = await Task.find({ userEmail: email })
    .skip(pageSize * (pageIndex - 1) || 0)
    .limit(pageSize || 5);

  const taskCount = await Task.countDocuments({ userEmail: email });

  if (category || search || priority)
    tasks = tasks.filter((task) => {
      return (
        (!category || task.category == category) &&
        (!search || task.title.startsWith(search)) &&
        (!priority || task.priority == priority)
      );
    });

  return res.status(200).json({ tasks, total: taskCount });
});

/*
  GET: /api/task/:id
*/
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const task = await Task.findOne({ _id: id });

  if (!task) return res.status(404).json({ message: "Task Not Found!" });

  return res.status(200).json(task);
});

function getUserEmail(req) {
  const token = req.headers.authorization?.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.email;
}

router.put("/:id/toggle-complete", async (req, res) => {
  const { id } = req.params;
  const { status, progress, completed } = req.body;

  const completedTask = await Task.findByIdAndUpdate(
    id,
    { $set: { completed: completed, progress: progress, status: status } },
    { new: true, runValidators: true }
  );

  res.status(200).json(completedTask);
});

/*
  POST: /api/task
*/
router.post("/", (req, res) => {
  const email = getUserEmail(req);

  if (!email)
    res.status(400).json({ message: "The Email Doens't exist in the token!" });

  const { title, description, dueDate, priority, category, status } = req.body;
  const task = new Task({
    title,
    description,
    dueDate,
    priority,
    category,
    completed: false,
    status,
    userEmail: email || "dummy@gmail.com",
    progress: 0,
  });

  task
    .save()
    .then(() => {
      res.status(201).json(task);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

/*
  PUT: /api/task/:id
*/
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description, dueDate, priority, category, status } =
      req.body;

    const task = await Task.findOne({ _id: id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.category = category || task.category;
    task.status = status || task.status;

    // Update the task and get the updated document
    const updatedTask = await Task.findByIdAndUpdate(id, task, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the task" });
  }
});

/*
  DELETE: /api/task/:id
*/
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Task.deleteOne({ _id: id })
    .then(() => {
      res.status(200).json({ message: "Task has been Deleted Successfully!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "An Error has been Ocurred!" });
    });
});

module.exports = router;
