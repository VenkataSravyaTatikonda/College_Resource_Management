const express = require("express");
const router = express.Router();

const upload = require("../../middlewares/multer.middleware");
const auth = require("../../middlewares/auth.middleware");

const {
  loginFacultyController,
  registerFacultyController,
  getAllFacultyController,
  updateFacultyController,
  deleteFacultyController,
  getMyFacultyDetailsController,
} = require("../../controllers/details/faculty-details.controller");

// 🔐 Login
router.post("/login", loginFacultyController);

// 👤 Logged-in faculty profile
router.get("/my-details", auth, getMyFacultyDetailsController);

// 👨‍🏫 Faculty CRUD
router.post("/register", auth, upload.single("file"), registerFacultyController);
router.get("/", auth, getAllFacultyController);
router.patch("/:id", auth, upload.single("file"), updateFacultyController);
router.delete("/:id", auth, deleteFacultyController);

module.exports = router;
