const express = require("express");
const router = express.Router();
const academicController = require("../controllers/academicController");

const  protect = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

console.log("academicController:", academicController);
console.log("saveAcademicData:", academicController.saveAcademicData);

// Student only
router.post(
  "/save",
  protect,
  allowRoles("student"),
  academicController.saveAcademicData
);

// All roles
router.get(
  "/:studentId",
  protect,
  allowRoles("student", "faculty", "admin"),
  academicController.getAcademicData
);

module.exports = router;
