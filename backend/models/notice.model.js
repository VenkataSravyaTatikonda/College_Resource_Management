const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    type: {
      type: String,
      enum: ["student", "faculty", "both"],
    },

    file: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    viewedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
