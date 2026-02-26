// models/Achievement.js

const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: String, // scholarship, internship, extracurricular
  title: String,
  description: String,
  date: Date,
});

module.exports = mongoose.model("Achievement", achievementSchema);