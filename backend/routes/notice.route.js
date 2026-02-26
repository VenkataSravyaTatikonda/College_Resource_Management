const express = require("express");
const router = express.Router();


const {
  getNoticeController,
  addNoticeController,
  updateNoticeController,
  deleteNoticeController,
  markNoticeAsViewedController,
  getNoticeViewStatus,
} = require("../controllers/notice.controller");

const auth = require("../middlewares/auth.middleware");
const noticeUpload = require("../middlewares/noticeUpload.middleware");

router.get("/", auth, getNoticeController);
router.post("/", auth, noticeUpload.single("file"), addNoticeController);
router.put("/:id", auth, updateNoticeController);
router.delete("/:id", auth, deleteNoticeController);
router.post("/:id/view", auth, markNoticeAsViewedController);
router.get("/:id/views", auth, getNoticeViewStatus);

module.exports = router;




