const Notice = require("../models/notice.model");
const ApiResponse = require("../utils/ApiResponse");
const Student = require("../models/details/student-details.model");

/* ================= GET ALL NOTICES ================= */
const getNoticeController = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("viewedBy.userId", "enrollmentNo firstName lastName");


    if (!notices.length) {
      return ApiResponse.notFound("No Notices Found").send(res);
    }

    return ApiResponse.success(notices, "Notices Loaded").send(res);
  } catch (error) {
    console.error("Get Notice Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};


/* ================= ADD NOTICE ================= */
const addNoticeController = async (req, res) => {
  try {
    const { title, description, type } = req.body;

    if (!req.file) {
      return ApiResponse.badRequest("File upload failed").send(res);
    }

    if (!title || !description || !type) {
      return ApiResponse.badRequest("All fields required").send(res);
    }

    const notice = await Notice.create({
      title,
      description,
      type,
      file: req.file.filename,   
      createdBy: req.userId,
      createdByModel: req.userRole === "admin" ? "Admin" : "Faculty",
    });

    return ApiResponse.created(notice, "Notice added").send(res);

  } catch (error) {
    console.error("Add Notice Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};




/* ================= UPDATE NOTICE ================= */
const updateNoticeController = async (req, res) => {
  const { title, description, type, link } = req.body;
  const updateFields = {};

  if (title) updateFields.title = title;
  if (description) updateFields.description = description;
  if (type) updateFields.type = type;
  if (link) updateFields.link = link;

  if (Object.keys(updateFields).length === 0) {
    return ApiResponse.badRequest("No fields provided for update").send(res);
  }

  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return ApiResponse.notFound("Notice Not Found").send(res);
    }

    // 🔐 only creator can update
    if (notice.createdBy.toString() !== req.userId) {
      return ApiResponse.unauthorized(
        "You are not allowed to update this notice"
      ).send(res);
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    return ApiResponse.success(
      updatedNotice,
      "Notice Updated Successfully!"
    ).send(res);
  } catch (error) {
    console.error("Update Notice Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

/* ================= DELETE NOTICE ================= */
const deleteNoticeController = async (req, res) => {
  try {
    if (!req.params.id) {
      return ApiResponse.badRequest("Notice ID is required").send(res);
    }

    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return ApiResponse.notFound("Notice Not Found").send(res);
    }

    // 🔐 only creator can delete
    if (notice.createdBy.toString() !== req.userId) {
      return ApiResponse.unauthorized(
        "You are not allowed to delete this notice"
      ).send(res);
    }

    await Notice.findByIdAndDelete(req.params.id);

    return ApiResponse.success(null, "Notice Deleted Successfully!").send(res);
  } catch (error) {
    console.error("Delete Notice Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

/* ================= MARK NOTICE AS VIEWED ================= */
const markNoticeAsViewedController = async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (!notice) {
    return ApiResponse.notFound("Notice not found").send(res);
  }

  const alreadyViewed = notice.viewedBy.some(
    (v) => v.userId.toString() === req.userId
  );

  if (!alreadyViewed) {
    notice.viewedBy.push({ userId: req.userId });
    await notice.save();
  }

  return ApiResponse.success(null, "Marked as viewed").send(res);
};



const getNoticeViewStatus = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id)
      .populate("viewedBy.userId", "firstName lastName enrollmentNo");

    if (!notice) {
      return ApiResponse.notFound("Notice not found").send(res);
    }

    const students = await Student.find(
      { status: "active" },
      "firstName lastName enrollmentNo"
    );

    return ApiResponse.success(
      {
        students,
        viewedBy: notice.viewedBy,
      },
      "View status loaded"
    ).send(res);
  } catch (err) {
    console.error(err);
    return ApiResponse.internalServerError().send(res);
  }
};



module.exports = {
  getNoticeController,
  addNoticeController,
  updateNoticeController,
  deleteNoticeController,
  markNoticeAsViewedController,
  getNoticeViewStatus,
};
