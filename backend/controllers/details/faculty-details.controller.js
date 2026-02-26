const facultyDetails = require("../../models/details/faculty-details.model");
const Branch = require("../../models/branch.model");
const resetToken = require("../../models/reset-password.model");
const bcrypt = require("bcryptjs");
const ApiResponse = require("../../utils/ApiResponse");
const jwt = require("jsonwebtoken");
const sendResetMail = require("../../utils/SendMail");

/* ================= LOGIN ================= */
const loginFacultyController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await facultyDetails.findOne({ email });
    if (!user) {
      return ApiResponse.notFound("User not found").send(res);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ApiResponse.unauthorized("Invalid password").send(res);
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return ApiResponse.success({ token }, "Login successful").send(res);
  } catch (error) {
    console.error("Login Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

/* ================= REGISTER FACULTY ================= */
const registerFacultyController = async (req, res) => {
  try {
    const { email, phone, branchId } = req.body;
    const profile = req.file?.filename;

    if (!branchId) {
      return ApiResponse.badRequest("Branch is required").send(res);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ApiResponse.badRequest("Invalid email format").send(res);
    }

    if (!/^\d{10}$/.test(phone)) {
      return ApiResponse.badRequest("Phone number must be 10 digits").send(res);
    }

    const existing = await facultyDetails.findOne({
      $or: [{ email }, { phone }],
    });

    if (existing) {
      return ApiResponse.conflict(
        "Faculty with these details already exists"
      ).send(res);
    }

    /* 🔹 GET BRANCH CODE */
    const branchData = await Branch.findById(branchId);
    if (!branchData) {
      return ApiResponse.badRequest("Invalid Branch").send(res);
    }

    const branchCode = branchData.code; // CSE / ECE / IT

    /* 🔹 GENERATE EMPLOYEE ID → BEC + BranchCode + Number */
    const count = await facultyDetails.countDocuments({
      employeeId: { $regex: `^BEC${branchCode}` },
    });

    const rollNo = String(count + 1).padStart(3, "0");
    const employeeId = `BEC${branchCode}${rollNo}`;

    /* 🔹 CREATE FACULTY */
    const user = await facultyDetails.create({
      ...req.body,
      employeeId,
      profile,
      password: "faculty123",
    });

    const sanitizedUser = await facultyDetails
      .findById(user._id)
      .select("-__v -password");

    return ApiResponse.created(
      sanitizedUser,
      "Faculty Registered Successfully!"
    ).send(res);
  } catch (error) {
    console.error("Register Faculty Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

/* ================= GET ALL FACULTY ================= */
const getAllFacultyController = async (req, res) => {
  try {
    const users = await facultyDetails
      .find()
      .select("-__v -password")
      .populate("branchId");

    if (!users || users.length === 0) {
      return ApiResponse.notFound("No Faculty Found").send(res);
    }

    return ApiResponse.success(users, "Faculty Details Found!").send(res);
  } catch (error) {
    console.error("Get All Faculty Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

/* ================= UPDATE FACULTY ================= */
const updateFacultyController = async (req, res) => {
  try {
    if (!req.params.id) {
      return ApiResponse.badRequest("Faculty ID is required").send(res);
    }

    const updateData = { ...req.body };
    const { email, phone, password } = updateData;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ApiResponse.badRequest("Invalid email format").send(res);
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return ApiResponse.badRequest("Phone number must be 10 digits").send(res);
    }

    if (password && password.length < 8) {
      return ApiResponse.badRequest(
        "Password must be at least 8 characters"
      ).send(res);
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updateData.profile = req.file.filename;
    }

    if (updateData.dob) updateData.dob = new Date(updateData.dob);
    if (updateData.joiningDate)
      updateData.joiningDate = new Date(updateData.joiningDate);

    const updatedUser = await facultyDetails
      .findByIdAndUpdate(req.params.id, updateData, { new: true })
      .select("-__v -password");

    if (!updatedUser) {
      return ApiResponse.notFound("Faculty not found").send(res);
    }

    return ApiResponse.success(updatedUser, "Updated Successfully!").send(res);
  } catch (error) {
    console.error("Update Faculty Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};

/* ================= DELETE FACULTY ================= */
const deleteFacultyController = async (req, res) => {
  try {
    if (!req.params.id) {
      return ApiResponse.badRequest("Faculty ID is required").send(res);
    }

    const user = await facultyDetails.findByIdAndDelete(req.params.id);
    if (!user) {
      return ApiResponse.notFound("No Faculty Found").send(res);
    }

    return ApiResponse.success(null, "Deleted Successfully!").send(res);
  } catch (error) {
    console.error("Delete Faculty Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};
/* ================= GET MY FACULTY DETAILS ================= */
const getMyFacultyDetailsController = async (req, res) => {
  try {
    const user = await facultyDetails
      .findById(req.userId)
      .select("-password -__v")
      .populate("branchId");

    if (!user) {
      return ApiResponse.notFound("Faculty not found").send(res);
    }

    return ApiResponse.success(user, "My Details Found").send(res);
  } catch (error) {
    console.error("Get My Faculty Error:", error);
    return ApiResponse.internalServerError().send(res);
  }
};


module.exports = {
  loginFacultyController,
  registerFacultyController,
  getAllFacultyController,
  updateFacultyController,
  deleteFacultyController,
  getMyFacultyDetailsController,
};
