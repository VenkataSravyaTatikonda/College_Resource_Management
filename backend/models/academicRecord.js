const mongoose = require("mongoose");

/* ================= SUBJECT SCHEMA ================= */
const subjectSchema = new mongoose.Schema({
  courseCode: { type: String, default: "" },
  courseName: { type: String, default: "" },
  credits: { type: Number, default: 0 },

  /* Attendance */
  attendanceMonth1: { type: Number, default: 0 },
  attendanceMonth2: { type: Number, default: 0 },
  attendanceMonth3: { type: Number, default: 0 },
  attendanceFinal: { type: Number, default: 0 },

  /* AAT */
  aat1: { type: Number, default: 0 },
  aat2: { type: Number, default: 0 },

  /* MID */
  mid1: { type: Number, default: 0 },
  mid2: { type: Number, default: 0 },

  /* Marks */
  cie: { type: Number, default: 0 },
  see: { type: Number, default: 0 },

  total: { type: Number, default: 0 },
  grade: { type: String, default: "" },

  isBacklog: { type: Boolean, default: false },
});

/* ================= SEMESTER SCHEMA ================= */
const semesterSchema = new mongoose.Schema({
  semesterNumber: { type: Number, required: true },
  academicYear: { type: String, default: "" },

  subjects: [subjectSchema],

  sgpa: { type: Number, default: 0 },
  cgpa: { type: Number, default: 0 },
  totalCredits: { type: Number, default: 0 },
  backlogs: { type: Number, default: 0 },
});

/* ================= MAIN ================= */
const academicRecordSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    semesters: [semesterSchema],
    overallCGPA: { type: Number, default: 0 },
    totalBacklogs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademicRecord", academicRecordSchema);