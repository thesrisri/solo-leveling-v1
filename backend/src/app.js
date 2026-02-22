const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./modules/auth/auth.routes");
const challengeRoutes = require("./modules/challenge/challenge.routes");
const taskRoutes = require("./modules/tasks/task.routes");
const dailyRoutes = require("./modules/daily/daily.routes");
const dashboardRoutes = require("./modules/dashboard/dashboard.routes");
const subtaskRoutes = require("./modules/subtasks/subtask.routes");
const pool = require("./config/db");
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173","https://solo-leveling-v1-frontend.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/challenges", challengeRoutes);
app.use("/tasks", taskRoutes);
app.use("/daily", dailyRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/subtasks", subtaskRoutes);
module.exports = app;