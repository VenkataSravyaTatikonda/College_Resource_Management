const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    applyLink: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin-details", // or faculty-details
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drive", driveSchema);
