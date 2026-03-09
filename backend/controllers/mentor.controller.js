const Mentor = require("../models/mentorDetails.model");

const saveMentorDetails = async (req, res) => {
  try {

    const {
      studentId,
      hobbies,
      strength,
      weakness,
      healthRecord,
      otherInfo,
      scholarships,
      internships
    } = req.body;

    const mentor = await Mentor.findOneAndUpdate(
      { studentId },
      {
        hobbies: JSON.parse(hobbies || "[]"),
        strength: JSON.parse(strength || "[]"),
        weakness: JSON.parse(weakness || "[]"),
        healthRecord: JSON.parse(healthRecord || "[]"),
        otherInfo,
        scholarships: JSON.parse(scholarships || "[]"),
        internships: JSON.parse(internships || "[]")
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: mentor
    });

  } catch (error) {

    console.error("Save mentor error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }
};

const getMentorDetails = async (req, res) => {

  try {

    const { studentId } = req.params;

    const mentor = await Mentor.findOne({ studentId });

    res.status(200).json({
      success: true,
      data: mentor
    });

  } catch (error) {

    console.error("Fetch mentor error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};

module.exports = {
  saveMentorDetails,
  getMentorDetails
};