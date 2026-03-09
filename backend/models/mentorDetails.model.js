const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema({

studentId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Student",
required: true
},

scholarships: [
{
title: String,
certificate: String
}
],

internships: [
{
company: String,
startDate: String,
endDate: String,
certificate: String
}
],

hobbies: [String],

strength: [String],

weakness: [String],

healthRecord: [String],

otherInfo: String

},
{ timestamps: true }
);

module.exports = mongoose.model("Mentor", mentorSchema);