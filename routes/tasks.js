const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const router = express.Router();

// GET all tasks (dashboard)
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user.id });
  res.render("dashboard", { tasks });
});

// CREATE task
router.post("/", auth, async (req, res) => {
  const { title, description, dueDate } = req.body;
  await Task.create({
    title,
    description,
    dueDate,
    assignedTo: req.user.id,
  });
  res.redirect("/api/tasks");
});

// UPDATE task
router.post("/update/:id", auth, async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const task = await Task.findOne({ _id: req.params.id, assignedTo: req.user.id });
  if (!task) return res.send("Not authorized");

  task.title = title;
  task.description = description;
  task.status = status;
  task.dueDate = dueDate;
  await task.save();

  res.redirect("/api/tasks");
});

// DELETE task
router.get("/delete/:id", auth, async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, assignedTo: req.user.id });
  res.redirect("/api/tasks");
});

module.exports = router;



