require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const clearTodayTasks = require("./utils/clearTasks");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/subjects", require("./routes/subjects"));

// جدولة حذف التاسكات في نهاية اليوم (منتصف الليل)
cron.schedule("0 0 * * *", async () => {
  await clearTodayTasks();
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/lessons", require("./routes/lessons"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/studies", require("./routes/studies"));
app.use("/api/stats-v2", require("./routes/statsV2"));
app.use("/api/quotes", require("./routes/quotes"));
app.get("/", (req, res) => {
  res.send("Ratibha backend is running");
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
