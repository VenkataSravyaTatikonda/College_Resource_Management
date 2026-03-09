const express = require("express");
const router = express.Router();

const upload = require("../middlewares/mentorUpload.middleware");
const auth = require("../middlewares/auth.middleware");

const {
saveMentorDetails,
getMentorDetails
} = require("../controllers/mentor.controller");

router.post(
"/save",
auth,
upload.any(),
saveMentorDetails
);

router.get("/:studentId",auth,getMentorDetails);

module.exports = router;