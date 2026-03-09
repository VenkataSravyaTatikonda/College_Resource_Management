import React, { useEffect, useState } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";
import toast from "react-hot-toast";

const FacultyStudent = ({ setSelectedStudentId, setSelectedMenu }) => {
  const token = localStorage.getItem("userToken");

  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useState({
    enrollmentNo: "",
    name: "",
    semester: "",
    branch: "",
  });

  /* ================= FETCH BRANCHES ================= */

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axiosWrapper.get("/branch", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setBranches(res.data.data);
        }
      } catch {
        toast.error("Failed to load branches");
      }
    };

    fetchBranches();
  }, [token]);

  /* ================= SEARCH INPUT ================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= SEARCH STUDENTS ================= */

  const searchStudents = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axiosWrapper.post("/student/search", searchParams, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setStudents(res.data.data || []);
      }
    } catch {
      toast.error("Error searching students");
      setStudents([]);
    }

    setLoading(false);
  };

  /* ================= VIEW ACADEMIC ================= */

  const handleViewAcademic = (studentId) => {
    setSelectedStudentId(studentId);
    setSelectedMenu("mentor");
  };

  /* ================= DELETE STUDENT ================= */

  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?",
    );

    if (!confirmDelete) return;

    try {
      const res = await axiosWrapper.delete(`/student/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Student deleted");

        setStudents((prev) =>
          prev.filter((student) => student._id !== studentId),
        );
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Student Management</h2>

      {/* ================= SEARCH FORM ================= */}

      <form onSubmit={searchStudents} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            name="enrollmentNo"
            placeholder="Enrollment Number"
            value={searchParams.enrollmentNo}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={searchParams.name}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />

          <select
            name="semester"
            value={searchParams.semester}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="">Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>

          <select
            name="branch"
            value={searchParams.branch}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="">Branch</option>

            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {/* ================= TABLE ================= */}

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

                  <td className="border p-3">{student.enrollmentNo}</td>

                  <td className="border p-3">{student.semester}</td>

                  <td className="border p-3">{student.branchId?.name}</td>

                  <td className="border p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleViewAcademic(student._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        View Academic
                      </button>

                      <button
                        onClick={() => handleDelete(student._id)}
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
