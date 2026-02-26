import React, { useEffect, useState, useCallback } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";
import DriveCard from "./DriveCard";
import toast from "react-hot-toast";

const TNP = ({ role }) => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const token = localStorage.getItem("userToken");

  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    deadline: "",
    applyLink: "",
  });

  /* ================= FETCH DRIVES ================= */
  const fetchDrives = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axiosWrapper.get("/tnp/drives", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDrives(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load drives");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  /* ================= CREATE DRIVE ================= */
  const createDrive = async (e) => {
    e.preventDefault();

    try {
      await axiosWrapper.post(
        "/tnp/drive",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Drive created successfully");

      setShowCreate(false);
      setFormData({
        companyName: "",
        role: "",
        deadline: "",
        applyLink: "",
      });

      fetchDrives();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating drive");
    }
  };

  /* ================= UI STATES ================= */
  if (loading) {
    return <div className="p-6">Loading drives...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* ===== CREATE BUTTON ===== */}
      {(role === "admin" || role === "faculty") && (
        <div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showCreate ? "Cancel" : "Create Drive"}
          </button>
        </div>
      )}

      {/* ===== CREATE FORM ===== */}
      {showCreate && (
        <form
          onSubmit={createDrive}
          className="bg-white p-6 rounded shadow space-y-3"
        >
          <input
            type="text"
            placeholder="Company Name"
            className="border p-2 w-full"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Role"
            className="border p-2 w-full"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            required
          />

          <input
            type="date"
            className="border p-2 w-full"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Apply Link"
            className="border p-2 w-full"
            value={formData.applyLink}
            onChange={(e) =>
              setFormData({ ...formData, applyLink: e.target.value })
            }
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Drive
          </button>
        </form>
      )}

      {/* ===== NO DRIVES ===== */}
      {drives.length === 0 && (
        <div className="text-gray-500">No drives available</div>
      )}

      {/* ===== DRIVE LIST ===== */}
      {drives.map((drive) => (
        <DriveCard
          key={drive._id}
          drive={drive}
          role={role}
          refreshDrives={fetchDrives}
        />
      ))}
    </div>
  );
};

export default TNP;
