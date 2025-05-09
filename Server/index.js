const dotenv = require("dotenv");
const express = require("express");
const AUTH_ROUTES = require("./auth/auth.controller.js");
const TASK_ROUTES = require("./task/task.controller.js");
const cors = require("cors");
const app = express();
const STATIC_SEGMENT = "/api";
dotenv.config();
const mongoose = require("mongoose");
const authenticate = require("./auth/auth.middleware.js");
const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

app.use(express.json());

mongoose.connect(process.env.DATABASE_CONNECTION);

app.use(`${STATIC_SEGMENT}/auth`, AUTH_ROUTES);
app.use(`${STATIC_SEGMENT}/task`, authenticate, TASK_ROUTES);

// فقط في حالة عدم كوننا في بيئة الاختبار يتم تشغيل السيرفر
if (require.main === module) {
  app.listen(5000, () => console.log("Server is Listening!"));
}

module.exports = app;
