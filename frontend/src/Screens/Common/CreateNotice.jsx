import React, { useState } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";
import toast from "react-hot-toast";
import Heading from "../../components/Heading";
import CustomButton from "../../components/CustomButton";

const CreateNotice = ({ goBack }) => {
  const token = localStorage.getItem("userToken");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "student",
    file: null,
  });

  const [loading, setLoading] = useState(false);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData((prev) => ({
        ...prev,
        file: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      toast.error("Please upload a file");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("file", formData.file); // IMPORTANT → must be "file"

    try {
      setLoading(true);

      const res = await axiosWrapper.post("/notice", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Notice created successfully");

        // Reset form
        setFormData({
          title: "",
          description: "",
          type: "student",
          file: null,
        });

        if (goBack) {
          goBack(); // Return to notice list
        }
      }
    } catch (err) {
      toast.error("Failed to create notice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <Heading title="Create Notice" />

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">

        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* TYPE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Notice Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* FILE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload File
          </label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            required
            className="w-full"
          />
          {formData.file && (
            <p className="text-xs text-gray-500 mt-1">
              Selected: {formData.file.name}
            </p>
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 pt-4">
          <CustomButton type="submit">
            {loading ? "Creating..." : "Create"}
          </CustomButton>

          <CustomButton
            type="button"
            variant="secondary"
            onClick={goBack}
          >
            Cancel
          </CustomButton>
        </div>

      </form>
    </div>
  );
};

export default CreateNotice;