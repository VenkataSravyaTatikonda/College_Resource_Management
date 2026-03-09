import React, { useState, useEffect } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";

const MentorForm = ({ studentId }) => {

  const token = localStorage.getItem("userToken");

  /* ================= STATES ================= */

  const [scholarships, setScholarships] = useState([
    { title: "", certificate: null }
  ]);

  const [internships, setInternships] = useState([
    { company: "", startDate: "", endDate: "", certificate: null }
  ]);

  const [hobbies, setHobbies] = useState([""]);
  const [strengths, setStrengths] = useState([""]);
  const [weaknesses, setWeaknesses] = useState([""]);
  const [healthRecords, setHealthRecords] = useState([""]);
  const [otherInfo, setOtherInfo] = useState("");

  /* ================= FETCH DATA ================= */

  const fetchMentorDetails = async () => {

  try {

    const res = await axiosWrapper.get(
      `/mentor/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (res.data.success && res.data.data) {

      const data = res.data.data;

      setHobbies(
        Array.isArray(data.hobbies)
          ? data.hobbies
          : typeof data.hobbies === "string"
          ? JSON.parse(data.hobbies)
          : [""]
      );

      setStrengths(
        Array.isArray(data.strength)
          ? data.strength
          : typeof data.strength === "string"
          ? JSON.parse(data.strength)
          : [""]
      );

      setWeaknesses(
        Array.isArray(data.weakness)
          ? data.weakness
          : typeof data.weakness === "string"
          ? JSON.parse(data.weakness)
          : [""]
      );

      setHealthRecords(
        Array.isArray(data.healthRecord)
          ? data.healthRecord
          : typeof data.healthRecord === "string"
          ? JSON.parse(data.healthRecord)
          : [""]
      );

      setOtherInfo(data.otherInfo || "");

      setScholarships(
        data.scholarships?.length
          ? data.scholarships
          : [{ title: "", certificate: null }]
      );

      setInternships(
        data.internships?.length
          ? data.internships
          : [{ company: "", startDate: "", endDate: "", certificate: null }]
      );

    }

  } catch (error) {

    console.log("Error loading mentor data", error);

  }

};
  useEffect(() => {

    fetchMentorDetails();

  }, []);

  /* ================= GENERIC FUNCTIONS ================= */

  const handleDynamicChange = (index, value, setter, array) => {

    const rows = [...array];

    rows[index] = value;

    setter(rows);

  };

  const addRow = (setter, array) => {

    setter([...array, ""]);

  };

  const deleteRow = (index, setter, array) => {

    const rows = [...array];

    rows.splice(index, 1);

    setter(rows);

  };

  /* ================= SCHOLARSHIPS ================= */

  const handleScholarshipChange = (index, field, value) => {

    const rows = [...scholarships];

    rows[index][field] = value;

    setScholarships(rows);

  };

  const addScholarshipRow = () => {

    setScholarships([...scholarships, { title: "", certificate: null }]);

  };

  const deleteScholarshipRow = (index) => {

    const rows = [...scholarships];

    rows.splice(index, 1);

    setScholarships(rows);

  };

  /* ================= INTERNSHIPS ================= */

  const handleInternshipChange = (index, field, value) => {

    const rows = [...internships];

    rows[index][field] = value;

    setInternships(rows);

  };

  const addInternshipRow = () => {

    setInternships([
      ...internships,
      { company: "", startDate: "", endDate: "", certificate: null }
    ]);

  };

  const deleteInternshipRow = (index) => {

    const rows = [...internships];

    rows.splice(index, 1);

    setInternships(rows);

  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    try {

      const form = new FormData();

      form.append("studentId", studentId);

      form.append("hobbies", JSON.stringify(hobbies));
      form.append("strength", JSON.stringify(strengths));
      form.append("weakness", JSON.stringify(weaknesses));
      form.append("healthRecord", JSON.stringify(healthRecords));
      form.append("otherInfo", otherInfo);

      form.append("scholarships", JSON.stringify(scholarships));
      form.append("internships", JSON.stringify(internships));

      scholarships.forEach((row) => {

        if (row.certificate) {

          form.append("certificate", row.certificate);

        }

      });

      internships.forEach((row) => {

        if (row.certificate) {

          form.append("certificate", row.certificate);

        }

      });

      await axiosWrapper.post(
        "/mentor/save",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Mentor Details Saved");

      fetchMentorDetails();

    } catch (error) {

      console.log(error);

      alert("Error saving data");

    }

  };

  /* ================= UI ================= */

  return (

  <div className="p-6">

  <h2 className="text-xl font-bold mb-4">Mentor Details</h2>

  {/* SCHOLARSHIPS */}

  <h3 className="font-semibold mt-4">Scholarships / Awards</h3>

  {scholarships.map((row,index)=>(

  <div key={index} className="flex gap-3 mt-2">

  <input
  type="text"
  className="border p-2 w-1/3"
  placeholder="Scholarship Title"
  value={row.title}
  onChange={(e)=>handleScholarshipChange(index,"title",e.target.value)}
  />

  <input
  type="file"
  onChange={(e)=>handleScholarshipChange(index,"certificate",e.target.files[0])}
  />

  <button
  className="bg-red-500 text-white px-3"
  onClick={()=>deleteScholarshipRow(index)}
  >
  Delete
  </button>

  </div>

  ))}

  <button
  className="bg-green-600 text-white px-3 py-1 mt-2"
  onClick={addScholarshipRow}
  >
  + Add Row
  </button>

  {/* INTERNSHIPS */}

  <h3 className="font-semibold mt-6">Internship / Industrial Training</h3>

  {internships.map((row,index)=>(

  <div key={index} className="flex gap-3 mt-2">

  <input
  type="text"
  className="border p-2"
  placeholder="Company"
  value={row.company}
  onChange={(e)=>handleInternshipChange(index,"company",e.target.value)}
  />

  <input
  type="date"
  className="border p-2"
  value={row.startDate}
  onChange={(e)=>handleInternshipChange(index,"startDate",e.target.value)}
  />

  <input
  type="date"
  className="border p-2"
  value={row.endDate}
  onChange={(e)=>handleInternshipChange(index,"endDate",e.target.value)}
  />

  <input
  type="file"
  onChange={(e)=>handleInternshipChange(index,"certificate",e.target.files[0])}
  />

  <button
  className="bg-red-500 text-white px-3"
  onClick={()=>deleteInternshipRow(index)}
  >
  Delete
  </button>

  </div>

  ))}

  <button
  className="bg-green-600 text-white px-3 py-1 mt-2"
  onClick={addInternshipRow}
  >
  + Add Row
  </button>

  {/* HOBBIES */}

  <h3 className="font-semibold mt-6">Hobbies</h3>

  {hobbies.map((item,index)=>(

  <div key={index} className="flex gap-3 mt-2">

  <input
  className="border p-2 w-1/2"
  value={item}
  onChange={(e)=>handleDynamicChange(index,e.target.value,setHobbies,hobbies)}
  />

  <button
  className="bg-red-500 text-white px-3"
  onClick={()=>deleteRow(index,setHobbies,hobbies)}
  >
  Delete
  </button>

  </div>

  ))}

  <button
  className="bg-green-600 text-white px-3 py-1 mt-2"
  onClick={()=>addRow(setHobbies,hobbies)}
  >
  + Add Row
  </button>

  {/* STRENGTH */}

  <h3 className="font-semibold mt-6">Strength</h3>

  {strengths.map((item,index)=>(

  <div key={index} className="flex gap-3 mt-2">

  <input
  className="border p-2 w-1/2"
  value={item}
  onChange={(e)=>handleDynamicChange(index,e.target.value,setStrengths,strengths)}
  />

  <button
  className="bg-red-500 text-white px-3"
  onClick={()=>deleteRow(index,setStrengths,strengths)}
  >
  Delete
  </button>

  </div>

  ))}

  <button
  className="bg-green-600 text-white px-3 py-1 mt-2"
  onClick={()=>addRow(setStrengths,strengths)}
  >
  + Add Row
  </button>

  {/* WEAKNESS */}

  <h3 className="font-semibold mt-6">Weakness</h3>

  {weaknesses.map((item,index)=>(

  <div key={index} className="flex gap-3 mt-2">

  <input
  className="border p-2 w-1/2"
  value={item}
  onChange={(e)=>handleDynamicChange(index,e.target.value,setWeaknesses,weaknesses)}
  />

  <button
  className="bg-red-500 text-white px-3"
  onClick={()=>deleteRow(index,setWeaknesses,weaknesses)}
  >
  Delete
  </button>

  </div>

  ))}

  <button
  className="bg-green-600 text-white px-3 py-1 mt-2"
  onClick={()=>addRow(setWeaknesses,weaknesses)}
  >
  + Add Row
  </button>

  {/* HEALTH RECORD */}

  <h3 className="font-semibold mt-6">Health Record</h3>

  {healthRecords.map((item,index)=>(

  <div key={index} className="flex gap-3 mt-2">

  <input
  className="border p-2 w-1/2"
  value={item}
  onChange={(e)=>handleDynamicChange(index,e.target.value,setHealthRecords,healthRecords)}
  />

  <button
  className="bg-red-500 text-white px-3"
  onClick={()=>deleteRow(index,setHealthRecords,healthRecords)}
  >
  Delete
  </button>

  </div>

  ))}

  <button
  className="bg-green-600 text-white px-3 py-1 mt-2"
  onClick={()=>addRow(setHealthRecords,healthRecords)}
  >
  + Add Row
  </button>

  {/* OTHER INFO */}

  <textarea
  className="border p-2 w-full mt-4"
  placeholder="Other Information"
  value={otherInfo}
  onChange={(e)=>setOtherInfo(e.target.value)}
  />

  <button
  className="bg-blue-600 text-white px-6 py-2 mt-6"
  onClick={handleSubmit}
  >
  Save Mentor Details
  </button>

  </div>

  );

};

export default MentorForm;