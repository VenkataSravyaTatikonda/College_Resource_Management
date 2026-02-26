const mongoose = require("mongoose");

const Branch = new mongoose.Schema(
  {
    branchId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, 
      minlength: 2,
      maxlength: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Branch", Branch);
