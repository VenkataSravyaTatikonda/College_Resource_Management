const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    offerFile: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("OfferLetter", offerSchema);
