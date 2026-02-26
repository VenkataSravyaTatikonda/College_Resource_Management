import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import { CgDanger } from "react-icons/cg";

import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";
import axiosWrapper from "../../utils/AxiosWrapper";

const Subject = () => {
  const [data, setData] = useState({
    name: "",
    code: "",
    branch: "",
    semester: "",
    credits: "",
  });

  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("userToken");

  /* ================= GET SUBJECTS ================= */
  const getSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosWrapper.get("/subject", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data?.data || []);
    } catch {
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ================= GET BRANCHES ================= */
  const getBranches = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosWrapper.get("/branch", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranches(res.data?.data || []);
    } catch {
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getSubjects();
    getBranches();
  }, [getSubjects, getBranches]);

  /* ================= ADD / UPDATE ================= */
  const submitHandler = async () => {
    if (!data.name || !data.code || !data.branch || !data.semester || !data.credits) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);
      const url = isEditing ? `/subject/${selectedSubjectId}` : "/subject";
      const method = isEditing ? "patch" : "post";

      await axiosWrapper[method](url, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(isEditing ? "Subject Updated" : "Subject Added");
      resetForm();
      getSubjects();
    } catch (err) {
      console.log("UPDATE ERROR 👉", err.response?.data);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const editHandler = (item) => {
    setData({
      name: item.name,
      code: item.code,
      branch: item.branch?._id,
      semester: item.semester,
      credits: item.credits,
    });
    setSelectedSubjectId(item._id);
    setIsEditing(true);
    setShowModal(true);
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axiosWrapper.delete(`/subject/${selectedSubjectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Subject deleted");
      getSubjects();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
      setIsDeleteConfirmOpen(false);
    }
  };

  const resetForm = () => {
    setData({ name: "", code: "", branch: "", semester: "", credits: "" });
    setShowModal(false);
    setIsEditing(false);
    setSelectedSubjectId(null);
  };

  /* ================= UI ================= */
  return (
    <div className="w-full mt-10">
      <div className="flex justify-between items-center">
        <Heading title="Subject Details" />
        {branches.length > 0 && (
          <CustomButton onClick={() => setShowModal(true)}>
            <IoMdAdd />
          </CustomButton>
        )}
      </div>

      {loading && <Loading />}

      {!loading && branches.length === 0 && (
        <div className="flex flex-col items-center mt-24">
          <CgDanger size={60} className="text-yellow-500" />
          <p>Add branches first</p>
        </div>
      )}

      {!loading && subjects.length > 0 && (
        <table className="min-w-full mt-6">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Branch</th>
              <th>Semester</th>
              <th>Credits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((item) => (
              <tr key={item._id} className="border-b">
                <td>{item.name}</td>
                <td>{item.code}</td>
                <td>{item.branch?.name}</td>
                <td>{item.semester}</td>
                <td>{item.credits}</td>
                <td className="flex gap-3 justify-center">
                  <CustomButton onClick={() => editHandler(item)}>
                    <MdEdit />
                  </CustomButton>
                  <CustomButton
                    variant="danger"
                    onClick={() => {
                      setSelectedSubjectId(item._id);
                      setIsDeleteConfirmOpen(true);
                    }}
                  >
                    <MdOutlineDelete />
                  </CustomButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 w-full max-w-xl rounded">
            <div className="flex justify-between mb-4">
              <h2>{isEditing ? "Update Subject" : "Add Subject"}</h2>
              <AiOutlineClose onClick={resetForm} className="cursor-pointer" />
            </div>

            {["name", "code", "credits"].map((field) => (
              <input
                key={field}
                className="w-full border p-2 mb-3"
                placeholder={field}
                value={data[field]}
                onChange={(e) => setData({ ...data, [field]: e.target.value })}
              />
            ))}

            <select
              className="w-full border p-2 mb-3"
              value={data.branch}
              onChange={(e) => setData({ ...data, branch: e.target.value })}
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              className="w-full border p-2 mb-3"
              value={data.semester}
              onChange={(e) => setData({ ...data, semester: e.target.value })}
            >
              <option value="">Select Semester</option>
              {[1,2,3,4,5,6,7,8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>

            <div className="flex justify-end gap-4">
              <CustomButton variant="secondary" onClick={resetForm}>
                Cancel
              </CustomButton>
              <CustomButton onClick={submitHandler}>
                {isEditing ? "Update" : "Add"}
              </CustomButton>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onConfirm={confirmDelete}
        onClose={() => setIsDeleteConfirmOpen(false)}
        message="Delete this subject?"
      />
    </div>
  );
};

export default Subject;
