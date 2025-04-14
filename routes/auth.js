const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// GET register page
router.get("/register", (req, res) => res.render("register"));

// POST register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashed });
    res.redirect("/api/auth/login");
  } catch (err) {
    res.send("User already exists or error");
  }
});

// GET login page
router.get("/login", (req, res) => res.render("login"));

// POST login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.send("Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token);
  res.redirect("/api/tasks");
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/api/auth/login");
});

module.exports = router;
