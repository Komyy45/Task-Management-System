const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const users = require("../models/user.js");
const User = require("../models/user.js");
const mongoose = require("mongoose");
const authenticate = require("./auth.middleware.js");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, password, email, phone, maleOrFemale } =
    req.body;

  const existingUser = await User.findOne({ email: email });

  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    phone,
    maleOrFemale,
    email,
    password: hashedPassword,
  });

  newUser
    .save()
    .then(() =>
      res.status(201).json({ message: "User registered successfully!" })
    )
    .catch(() =>
      res.status(500).json({ message: "An Error has been occured!" })
    );
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({ email, token });
});

router.get("/user", authenticate, async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const email = decoded.email;

  const currentUser = await User.findOne({ email: email }).select(
    "-password -__v"
  );

  if (!currentUser) return res.status(404).json({ message: "User not found" });

  return res.status(200).json(currentUser);
});

module.exports = router;
