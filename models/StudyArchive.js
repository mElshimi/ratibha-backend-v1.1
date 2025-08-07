const mongoose = require("mongoose");

const studyArchiveSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    date: { type: String, required: true },
    duration: { type: Number, required: true },
    archivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
module.exports = mongoose.model("StudyArchive", studyArchiveSchema);
