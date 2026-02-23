require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect to database
connectDB();

app.use(cors());
app.use(express.json());

const PORT = 5000;

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/requirements", require("./routes/requirementRoutes"));
app.use("/api/testcases", require("./routes/testCaseRoutes"));
app.use("/api/rtm", require("./routes/rtmRoutes"));

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Backend Connected Successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});