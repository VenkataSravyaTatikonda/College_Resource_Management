import React, { useEffect, useState, useCallback } from "react";
import { HiOutlineCalendar } from "react-icons/hi";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import axiosWrapper from "../utils/AxiosWrapper";

import Loading from "../components/Loading";

const Notice = ({
  role="student",
  setSelectedMenu = null,
  setSelectedNoticeId = null,
}) => {

  const token = localStorage.getItem("userToken");

  const [notices, setNotices] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  /* ================= FETCH NOTICES ================= */
  const fetchNotices = useCallback(async () => {
    try {
      setDataLoading(true);
      const res = await axiosWrapper.get("/notice", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(res.data.data || []);
    } catch {
      toast.error("Failed to load notices");
      setNotices([]);
    } finally {
      setDataLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);


/* ================= DELETE NOTICE ================= */
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this notice?"
  );

  if (!confirmDelete) return;

  try {
    const res = await axiosWrapper.delete(`/notice/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      toast.success("Notice deleted successfully");
      fetchNotices(); // refresh list
    }
  } catch {
    toast.error("Failed to delete notice");
  }
};

  /* ================= OPEN NOTICE ================= */
  const openNotice = async (notice) => {
    try {
      await axiosWrapper.post(
        `/notice/${notice._id}/view`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch {}

    window.open(
      `http://localhost:4000/media/notices/${notice.file}`,
      "_blank"
    );
  };

  return (
    <div className="w-full my-10">

      <div className="flex justify-between items-center">
      <Heading title="Notices" />

      {/* CREATE NOTICE BUTTON */}
      <button
        onClick={() => {
          if (setSelectedMenu) {
            setSelectedMenu("create-notice");
          }
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Add Notice
      </button>
    </div>
      

      {dataLoading && <Loading />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {notices.map((n) => (
          <div
            key={n._id}
            className="bg-white p-6 rounded shadow hover:bg-blue-50"
          >
            <h3
              className="font-semibold cursor-pointer"
              onClick={() => openNotice(n)}
            >
              {n.title}
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              {n.description}
            </p>

            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span className="flex items-center">
                <HiOutlineCalendar className="mr-1" />
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
              <span>{n.type}</span>
            </div>

            {/* 🔥 IMPORTANT PART */}
            {setSelectedMenu && setSelectedNoticeId && (
              <button
                className="text-sm text-blue-600 underline mt-3"
                onClick={() => {
                  setSelectedNoticeId(n._id);
                  setSelectedMenu("notice-status");
                }}
              >
                View Status
              </button>
            )}

            {role === "admin" || role === "faculty" ? (
              <div className="flex gap-3 mt-3">

                {/* EDIT */}
                <button
                  className="text-sm text-yellow-600 underline"
                  onClick={() => {
                    setSelectedNoticeId(n._id);
                    setSelectedMenu("edit-notice");
                  }}
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  className="text-sm text-red-600 underline"
                  onClick={() => handleDelete(n._id)}
                >
                  Delete
                </button>

              </div>
            ) : null}



          </div>
        ))}
      </div>
    </div>
  );
};

export default Notice;
