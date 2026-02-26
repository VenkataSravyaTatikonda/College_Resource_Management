const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const {
  getSubjectController,
  addSubjectController,
  updateSubjectController,
  deleteSubjectController,
} = require("../controllers/subject.controller");

// GET all subjects
router.get("/", auth, getSubjectController);

// ADD subject
router.post("/", auth, addSubjectController);

// ✅ UPDATE subject  (VERY IMPORTANT)
router.patch("/:id", auth, updateSubjectController);

// DELETE subject
router.delete("/:id", auth, deleteSubjectController);

module.exports = router;
