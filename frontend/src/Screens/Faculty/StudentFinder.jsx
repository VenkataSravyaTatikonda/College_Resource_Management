import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosWrapper from "../../utils/AxiosWrapper";
import toast from "react-hot-toast";

const FacultyStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  /* ================= FETCH STUDENTS ================= */
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await axiosWrapper.get("/student", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setStudents(res.data.data);
        }
      } catch (err) {
        toast.error("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token]);

  /* ================= VIEW ACADEMIC ================= */
  const handleViewAcademic = (studentId) => {
    navigate(`/faculty/academic/${studentId}`);
  };

  /* ================= DELETE STUDENT ================= */
  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const res = await axiosWrapper.delete(`/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Student deleted successfully");
        setStudents((prev) =>
          prev.filter((student) => student._id !== studentId)
        );
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Student Management</h2>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Enrollment</th>
                <th className="border p-3 text-left">Semester</th>
                <th className="border p-3 text-left">Branch</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="border p-3">
                    {student.firstName} {student.lastName}
                  </td>

                  <td className="border p-3">
                    {student.enrollmentNo}
                  </td>

                  <td className="border p-3">
                    {student.semester}
                  </td>

                  <td className="border p-3">
                    {student.branchId?.name}
                  </td>

                  <td className="border p-3 text-center">
                    <div className="flex justify-center gap-2">

                      {/* View Academic */}
                      <button
                        onClick={() =>
                          handleViewAcademic(student._id)
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        View Academic
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          handleDelete(student._id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FacultyStudent;