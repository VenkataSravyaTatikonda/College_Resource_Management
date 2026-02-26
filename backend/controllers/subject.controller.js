const Subject = require("../models/subject.model");
const ApiResponse = require("../utils/ApiResponse");

/* ================= GET SUBJECTS ================= */
const getSubjectController = async (req, res) => {
  try {
    const { branch, semester } = req.query;
    let query = {};

    if (branch) query.branch = branch;
    if (semester) query.semester = semester;

    const subjects = await Subject.find(query).populate("branch");

    if (!subjects || subjects.length === 0) {
      return ApiResponse.error("No Subjects Found", 404).send(res);
    }

    return ApiResponse.success(subjects, "Subjects fetched successfully").send(
      res
    );
  } catch (error) {
    return ApiResponse.error(error.message, 500).send(res);
  }
};

/* ================= ADD SUBJECT ================= */
const addSubjectController = async (req, res) => {
  try {
    const { name, code, branch, semester, credits } = req.body;

    if (!name || !code || !branch || !semester || !credits) {
      return ApiResponse.error("All fields are required", 400).send(res);
    }

    const exists = await Subject.findOne({ code });
    if (exists) {
      return ApiResponse.error("Subject already exists", 409).send(res);
    }

    const subject = await Subject.create({
      name,
      code,
      branch,
      semester,
      credits,
    });

    return ApiResponse.created(subject, "Subject added successfully").send(res);
  } catch (error) {
    return ApiResponse.error(error.message, 500).send(res);
  }
};

/* ================= UPDATE SUBJECT ================= */
const updateSubjectController = async (req, res) => {
  try {
    const { name, code, branch, semester, credits } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, code, branch, semester, credits },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return ApiResponse.error("Subject Not Found", 404).send(res);
    }

    return ApiResponse.success(
      subject,
      "Subject Updated Successfully"
    ).send(res);
  } catch (error) {
    console.error("UPDATE SUBJECT ERROR 👉", error);
    return ApiResponse.error(error.message).send(res);
  }
};

/* ================= DELETE SUBJECT ================= */
const deleteSubjectController = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return ApiResponse.error("Subject not found", 404).send(res);
    }

    return ApiResponse.success(null, "Subject deleted successfully").send(res);
  } catch (error) {
    return ApiResponse.error(error.message, 500).send(res);
  }
};

module.exports = {
  getSubjectController,
  addSubjectController,
  updateSubjectController,
  deleteSubjectController,
};
