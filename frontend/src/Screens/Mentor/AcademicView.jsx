import React, { useEffect, useState } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";

const AcademicView = ({ studentId }) => {
  const token = localStorage.getItem("userToken");

  const [academic, setAcademic] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await axiosWrapper.get(`/student/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const academicRes = await axiosWrapper.get(`/academic/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (studentRes.data.success) {
          setStudent(studentRes.data.data);
        }

        if (academicRes.data.success) {
          setAcademic(academicRes.data.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchData();
  }, [studentId, token]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center mt-10 text-red-500">
        Student Data Not Found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">

      {/* ================= STUDENT PROFILE ================= */}

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-6">Student Profile</h2>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-semibold">
              {student.firstName} {student.lastName}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Enrollment</p>
            <p className="font-semibold">{student.enrollmentNo}</p>
          </div>

          <div>
            <p className="text-gray-500">Branch</p>
            <p className="font-semibold">{student.branchId?.name}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p>{student.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Phone</p>
            <p>{student.phone}</p>
          </div>

          <div>
            <p className="text-gray-500">Semester</p>
            <p>{student.semester}</p>
          </div>
        </div>
      </div>

      {/* ================= ACADEMIC DETAILS ================= */}

      <div className="space-y-8">

        {academic?.semesters?.length === 0 && (
          <p className="text-center text-gray-500">
            No Academic Data Found
          </p>
        )}

        {academic?.semesters?.map((sem, index) => {

          const backlogSubjects =
            sem.subjects?.filter((sub) => sub.grade === "F") || [];

          return (
            <div key={index} className="bg-white shadow rounded-lg p-6">

              <h2 className="text-lg font-bold mb-4">
                Semester {sem.semesterNumber} ({sem.academicYear})
              </h2>

              <div className="overflow-x-auto">

                <table className="min-w-full border text-sm text-center">

                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Code</th>
                      <th className="border p-2">Subject</th>
                      <th className="border p-2">Credits</th>

                      <th className="border p-2">AAT1</th>
                      <th className="border p-2">AAT2</th>
                      <th className="border p-2">MID1</th>
                      <th className="border p-2">MID2</th>

                      <th className="border p-2">CIE</th>
                      <th className="border p-2">SEE</th>

                      <th className="border p-2">Total</th>
                      <th className="border p-2">Grade</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sem.subjects?.map((sub, i) => {

                      const isLab = sub.type === "lab";

                      return (
                        <tr
                          key={i}
                          className={sub.grade === "F" ? "bg-red-100" : ""}
                        >
                          <td className="border p-1">
                            {sub.courseCode}
                          </td>

                          <td className="border p-1">
                            {sub.courseName}
                          </td>

                          <td className="border p-1">
                            {sub.credits}
                          </td>

                          <td className="border p-1">
                            {isLab ? "-" : sub.aat1}
                          </td>

                          <td className="border p-1">
                            {isLab ? "-" : sub.aat2}
                          </td>

                          <td className="border p-1">
                            {isLab ? "-" : sub.mid1}
                          </td>

                          <td className="border p-1">
                            {isLab ? "-" : sub.mid2}
                          </td>

                          <td className="border p-1">
                            {sub.cie}
                          </td>

                          <td className="border p-1">
                            {sub.see}
                          </td>

                          <td className="border p-1 font-semibold">
                            {sub.total}
                          </td>

                          <td className="border p-1 font-bold">
                            {sub.grade}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>

                </table>
              </div>

              {/* ================= RESULT SUMMARY ================= */}

              <div className="mt-4 grid grid-cols-3 gap-6 text-sm">
                <p><strong>SGPA:</strong> {sem.sgpa}</p>
                <p><strong>CGPA:</strong> {sem.cgpa}</p>
                <p><strong>Backlogs:</strong> {sem.backlogs}</p>
              </div>

              {/* ================= BACKLOG SUBJECTS ================= */}

              {backlogSubjects.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-red-600">
                    Backlog Subjects
                  </p>

                  <ul className="list-disc ml-6 text-red-500">
                    {backlogSubjects.map((sub, i) => (
                      <li key={i}>
                        {sub.courseCode} - {sub.courseName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AcademicView;