import React, { useEffect, useState, useCallback } from "react";
import { HiOutlineCalendar } from "react-icons/hi";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import axiosWrapper from "../utils/AxiosWrapper";

import Loading from "../components/Loading";

const Notice = ({
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
      <Heading title="Notices" />

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

            

          </div>
        ))}
      </div>
    </div>
  );
};

export default Notice;
