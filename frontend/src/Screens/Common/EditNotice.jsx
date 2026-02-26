import React, { useEffect, useState } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";
import toast from "react-hot-toast";

const EditNotice = ({ noticeId, goBack }) => {
  const token = localStorage.getItem("userToken");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
  });

  const [file, setFile] = useState(null);

  /* LOAD NOTICE DETAILS */
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await axiosWrapper.get(`/notice/${noticeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setFormData(res.data.data);
        }
      } catch {
        toast.error("Failed to load notice");
      }
    };

    fetchNotice();
  }, [noticeId, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("type", formData.type);

    if (file) data.append("file", file);

    try {
      const res = await axiosWrapper.put(
        `/notice/${noticeId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success("Notice updated successfully");
        goBack();
      }
    } catch {
      toast.error("Failed to update notice");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Edit Notice</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="general">General</option>
          <option value="exam">Exam</option>
          <option value="placement">Placement</option>
        </select>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
        >
          Update Notice
        </button>

      </form>
    </div>
  );
};

export default EditNotice;