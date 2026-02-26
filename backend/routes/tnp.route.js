const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/tnpUpload");
const controller = require("../controllers/tnp.controller");

/* DRIVE */
router.post("/drive", auth, controller.createDrive);
router.get("/drives", auth, controller.getDrives);
router.put("/drive/:id", auth, controller.updateDrive);
router.delete("/drive/:id", auth, controller.deleteDrive);

/* APPLY */
router.post("/apply/:driveId", auth, upload.single("resume"), controller.applyDrive);
router.get("/applications/:driveId", auth, controller.getApplications);

/* SELECT */
router.put("/select/:applicationId", auth, controller.markSelected);

/* OFFER LETTER */
router.post(
  "/offer/:applicationId",
  auth,
  upload.single("offer"),
  controller.uploadOffer
);

router.get("/my-applications", auth, controller.getMyApplications);
router.get("/check-application/:driveId",auth,controller.checkApplication);

module.exports = router;