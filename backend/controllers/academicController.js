const AcademicRecord = require("../models/academicRecord");
const { processSubjects } = require("../utils/academicUtils");

/* ================= SAVE ================= */
const saveAcademicData = async (req, res) => {
  console.log("save controller hit"); // Debug log
  try {
    const studentId = req.userId;

    let record = await AcademicRecord.findOne({ studentId });

    let cumulativeCredits = 0;
    let cumulativeWeighted = 0;
    let totalBacklogs = 0;

    const processedSemesters = req.body.semesters.map((sem) => {
      const {
        updatedSubjects,
        sgpa,
        totalCredits,
        backlogCount,
      } = processSubjects(sem.subjects);

      // Prepare backlog course details
      const backlogCourses = updatedSubjects
        .filter((sub) => sub.isBacklog)
        .map((sub) => ({
          courseCode: sub.courseCode,
          courseName: sub.courseName,
          examMonthYear: "",
          grade: sub.grade,
          marks: sub.total,
        }));

      // Update cumulative values
      cumulativeCredits += totalCredits;
      cumulativeWeighted += sgpa * totalCredits;
      totalBacklogs += backlogCount;

      const cgpa =
        cumulativeCredits === 0
          ? 0
          : Number((cumulativeWeighted / cumulativeCredits).toFixed(2));

      return {
        semesterNumber: sem.semesterNumber,
        academicYear: sem.academicYear,
        subjects: updatedSubjects,
        sgpa,
        cgpa,
        totalCredits,
        backlogs: backlogCount,
        backlogCourses,
      };
    });

    const overallCGPA =
      cumulativeCredits === 0
        ? 0
        : Number((cumulativeWeighted / cumulativeCredits).toFixed(2));

    if (!record) {
      record = new AcademicRecord({
        studentId,
        semesters: processedSemesters,
        overallCGPA,
        totalBacklogs,
      });
    } else {
      record.semesters = processedSemesters;
      record.overallCGPA = overallCGPA;
      record.totalBacklogs = totalBacklogs;
    }

    await record.save();

    res.json({
      success: true,
      message: "Academic data saved successfully with full automation",
      overallCGPA,
      totalBacklogs,
    });
  } catch (err) {
    console.error("Error saving academic data:", err);
    res.status(500).json({ message: "Error saving academic data" });
  }
};

/* ================= GET ================= */
const getAcademicData = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    const record = await AcademicRecord.findOne({ studentId });

    res.json({
      success: true,
      data: record,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching data" });
  }
};

module.exports = {
  saveAcademicData,
  getAcademicData,
};
