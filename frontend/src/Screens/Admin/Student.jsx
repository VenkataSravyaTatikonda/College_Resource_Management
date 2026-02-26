import React, {  useEffect, useState,useCallback } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete } from "react-icons/md";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import NoData from "../../components/NoData";

const Student = ({ setSelectedStudentId, setSelectedMenu }) => {
  const userToken = localStorage.getItem("userToken");
  //const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    enrollmentNo: "",
    name: "",
    semester: "",
    branch: "",
  });

  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ================= LOAD BRANCHES ================= */
  /*useEffect(() => {
    fetchBranches();
  }, []);*/

  const fetchBranches = useCallback(async () => {
    try {
      const response = await axiosWrapper.get(`/branch`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (response.data.success) {
        setBranches(response.data.data);
      }
    } catch (error) {
      toast.error("Error fetching branches");
    }
  }, [userToken]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  /*const handleViewAcademic = (studentId) => {
    navigate(`/admin/academic/${studentId}`);
  };*/


  /* ================= SEARCH ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const searchStudents = async (e) => {
    e.preventDefault();

    if (
      !searchParams.enrollmentNo &&
      !searchParams.name &&
      !searchParams.semester &&
      !searchParams.branch
    ) {
      toast.error("Please select at least one filter");
      return;
    }

    setDataLoading(true);
    setHasSearched(true);

    try {
      const response = await axiosWrapper.post(
        `/student/search`,
        searchParams,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      if (response.data.success) {
        setStudents(response.data.data || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error searching students");
      setStudents([]);
    } finally {
      setDataLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const deleteStudentHandler = (id) => {
    setDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axiosWrapper.delete(`/student/${deleteId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      if (response.data.success) {
        toast.success("Student deleted successfully");
        setIsDeleteConfirmOpen(false);
        setDeleteId(null);
        setStudents((prev) =>
          prev.filter((student) => student._id !== deleteId)
        );
      }
    } catch {
      toast.error("Error deleting student");
    }
  };

  return (
    <div className="w-full mx-auto mt-10 flex flex-col mb-10">
      <Heading title="Student Management" />

      {/* ================= SEARCH FORM ================= */}
      <form onSubmit={searchStudents} className="my-6">
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
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7,8].map((sem) => (
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
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch._id} value={branch._id}>
                {branch.name}
              </option>
            ))}
          </select>

        </div>

        <div className="mt-4">
          <CustomButton type="submit">
            {dataLoading ? "Searching..." : "Search"}
          </CustomButton>
        </div>
      </form>

      {/* ================= RESULTS ================= */}
      {hasSearched && students.length === 0 && (
        <NoData title="No students found" />
      )}

      {students.length > 0 && (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Enrollment</th>
                <th className="px-4 py-2 border">Semester</th>
                <th className="px-4 py-2 border">Branch</th>
                <th className="px-4 py-2 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    {student.firstName} {student.lastName}
                  </td>

                  <td className="px-4 py-2 border">
                    {student.enrollmentNo}
                  </td>

                  <td className="px-4 py-2 border">
                    {student.semester}
                  </td>

                  <td className="px-4 py-2 border">
                    {student.branchId?.name}
                  </td>

                  <td className="px-4 py-2 border text-center">
                    <div className="flex justify-center gap-2">

                      {/* VIEW ACADEMIC */}
                      <CustomButton
                        variant="primary"
                        onClick={() => {
                          setSelectedStudentId(student._id);
                          setSelectedMenu("mentor");
                        }}
                      >
                        View Academic
                      </CustomButton>

                      {/* DELETE */}
                      <CustomButton
                        variant="danger"
                        onClick={() => deleteStudentHandler(student._id)}
                      >
                        <MdOutlineDelete />
                      </CustomButton>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {isDeleteConfirmOpen && (
        <DeleteConfirm
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default Student;