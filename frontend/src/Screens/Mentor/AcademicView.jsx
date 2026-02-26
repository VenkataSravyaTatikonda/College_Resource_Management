import React, { useEffect, useState } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";

const AcademicView = ({ studentId }) => {
   
  const token = localStorage.getItem("userToken");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAcademic = async () => {
      try {
        const res = await axiosWrapper.get(
          `/academic/${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("StudentId:", studentId);
        console.log("API Response:", res.data);

        if (res.data.success && res.data.data) {
          setData(res.data.data);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Academic fetch error:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchAcademic();
    }
  }, [studentId, token]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading Academic Data...
      </div>
    );
  }

  /* ================= NO DATA ================= */
  if (!data || !data.semesters || data.semesters.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No Academic Data Found
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-8">
      {data.semesters.map((sem, index) => (
        <div key={index} className="border rounded-lg p-4 shadow-sm">

          <h2 className="text-lg font-bold mb-4">
            Semester {sem.semesterNumber} ({sem.academicYear})
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Course Code</th>
                  <th className="border p-2">Course Name</th>
                  <th className="border p-2">Credits</th>
                  <th className="border p-2">Total</th>
                  <th className="border p-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {sem.subjects?.map((sub, i) => (
                  <tr key={i}>
                    <td className="border p-1">{sub.courseCode}</td>
                    <td className="border p-1">{sub.courseName}</td>
                    <td className="border p-1">{sub.credits}</td>
                    <td className="border p-1">{sub.total}</td>
                    <td className="border p-1 font-semibold">
                      {sub.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-1 text-sm">
            <p><strong>SGPA:</strong> {sem.sgpa}</p>
            <p><strong>CGPA:</strong> {sem.cgpa}</p>
            <p><strong>Backlogs:</strong> {sem.backlogs}</p>
          </div>

        </div>
      ))}
    </div>
  );
};

export default AcademicView;