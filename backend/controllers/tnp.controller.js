const Drive = require("../models/Drive");
const Application = require("../models/Application");
const OfferLetter = require("../models/offerLetter");


/* ================= CREATE DRIVE ================= */
exports.createDrive = async (req, res) => {
  if (req.userRole !== "admin" && req.userRole !== "faculty") {
    return res.status(403).json({
      success: false,
      message: "Only admin or faculty can create drives",
    });
  }

  const drive = await Drive.create({
    ...req.body,
    createdBy: req.userId,
  });

  res.json({ success: true, data: drive });
};

/* ================= GET DRIVES ================= */
exports.getDrives = async (req, res) => {
  const drives = await Drive.find().sort({ createdAt: -1 });
  res.json({ success: true, data: drives });
};

/* ================= APPLY (ONLY STUDENT) ================= */
exports.applyDrive = async (req, res) => {
  if (req.userRole !== "student") {
    return res.status(403).json({
      success: false,
      message: "Only students can apply",
    });
  }

  const { driveId } = req.params;

  const already = await Application.findOne({
    driveId,
    studentId: req.userId,
  });

  if (already) {
    return res.status(400).json({
      success: false,
      message: "Already applied",
    });
  }

  const application = await Application.create({
    driveId,
    studentId: req.userId,
    resume: req.file?.filename || "",
  });

  res.json({ success: true, data: application });
};

/* ================= GET APPLICATIONS ================= */
exports.getApplications = async (req, res) => {
  if (req.userRole !== "admin" && req.userRole !== "faculty") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const apps = await Application.find({
    driveId: req.params.driveId,
  }).populate("studentId","firstName lastName");

  res.json({ success: true, data: apps });
};

/* ================= DELETE DRIVE ================= */
exports.deleteDrive = async (req, res) => {
  if (req.userRole !== "admin" && req.userRole !== "faculty") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  await Drive.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: "Drive deleted" });
};

/* ================= UPDATE DRIVE ================= */
exports.updateDrive = async (req, res) => {
  if (req.userRole !== "admin" && req.userRole !== "faculty") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const drive = await Drive.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ success: true, data: drive });
};

/* ================= MARK SELECTED ================= */
exports.markSelected = async (req, res) => {
  if (req.userRole !== "admin" && req.userRole !== "faculty") {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const application = await Application.findByIdAndUpdate(
    req.params.applicationId,
    { status: "selected" },
    { new: true }
  );

  res.json({ success: true, data: application });
};

/* ================= UPLOAD OFFER LETTER ================= */
exports.uploadOffer = async (req, res) => {
  if (req.userRole !== "student") {
    return res.status(403).json({
      success: false,
      message: "Only student can upload offer",
    });
  }

  const application = await Application.findById(
    req.params.applicationId
  );

  if (!application || application.status !== "selected") {
    return res.status(400).json({
      success: false,
      message: "Not selected for this drive",
    });
  }

  const offer = await OfferLetter.create({
    applicationId: application._id,
    studentId: req.userId,
    offerFile: req.file?.filename || "",
  });

  res.json({ success: true, data: offer });
};

exports.getMyApplications = async (req, res) => {
  if (req.userRole !== "student") {
    return res.status(403).json({
      success: false,
      message: "Only student allowed",
    });
  }

  const apps = await Application.find({
    studentId: req.userId,
  }).populate("driveId");

  res.json({ success: true, data: apps });
};

exports.checkApplication = async (req, res) => {
  if (req.userRole !== "student") {
    return res.json({ applied: false });
  }

  const existing = await Application.findOne({
    driveId: req.params.driveId,
    studentId: req.userId,
  });

  if (existing) {
    return res.json({
      applied: true,
      status: existing.status,
    });
  }

  res.json({ applied: false });
};