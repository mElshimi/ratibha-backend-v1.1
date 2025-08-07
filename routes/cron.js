const express = require("express");
const router = express.Router();
const clearTodayTasks = require("../utils/clearTasks");

router.get("/run-clear", async (req, res) => {
  try {
    await clearTodayTasks();
    res
      .status(200)
      .json({ message: "Tasks cleared and archived successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error running clear task." });
  }
});

module.exports = router;
