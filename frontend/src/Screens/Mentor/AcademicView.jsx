import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosWrapper from "../../utils/AxiosWrapper";

const AcademicView = () => {
  const { studentId } = useParams(); // ✅ Get from URL
  const token = localStorage.getItem("userToken");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log("AcademicView is rendering");

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        const res = await axiosWrapper.get(`/academic/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data.data);
      } catch (err) {
        console.error("Academic fetch error:", err);

        if (err.response?.status === 404) {
          setError("Academic record not found");
        } else if (err.response?.status === 401) {
          setError("Unauthorized access");
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchAcademicData();
    } else {
      setError("Invalid student ID");
      setLoading(false);
    }
  }, [studentId, token]);

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-medium">
        Loading Academic Data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!data || !data.semesters || data.semesters.length === 0) {
    return <div className="text-center mt-10">No Academic Data Found</div>;
  }

  /* ================= MAIN UI ================= */

  return (
    <div className="p-6">
      {data.semesters.map((sem, index) => (
        <div key={index} className="mb-10 border p-4 rounded shadow-sm">
          <h2 className="text-lg font-bold mb-4">
            Semester {sem.semesterNumber} ({sem.academicYear})
          </h2>

          <table className="min-w-full border text-xs text-center mb-4">
            <thead>
              <tr className="bg-gray-100">
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
                  <td className="border p-1 font-semibold">{sub.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 space-y-1 text-sm">
            <p>
              <strong>SGPA:</strong> {sem.sgpa}
            </p>
            <p>
              <strong>CGPA:</strong> {sem.cgpa}
            </p>
            <p>
              <strong>Backlogs:</strong> {sem.backlogs}
            </p>
          </div>

          {/* ===== BACKLOG COURSES ===== */}
          {sem.backlogCourses?.length > 0 && (
            <div className="mt-4 border p-3 rounded bg-red-50">
              <h3 className="text-red-600 font-semibold mb-2">
                Backlog Courses
              </h3>

              <table className="min-w-full border text-xs text-center">
                <thead>
                  <tr className="bg-red-100">
                    <th className="border p-2">Course Code</th>
                    <th className="border p-2">Course Name</th>
                    <th className="border p-2">Marks</th>
                    <th className="border p-2">Grade</th>
                  </tr>
                </thead>

                <tbody>
                  {sem.backlogCourses.map((b, i) => (
                    <tr key={i}>
                      <td className="border p-1">{b.courseCode}</td>
                      <td className="border p-1">{b.courseName}</td>
                      <td className="border p-1">{b.marks}</td>
                      <td className="border p-1 text-red-600 font-bold">
                        {b.grade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AcademicView;
