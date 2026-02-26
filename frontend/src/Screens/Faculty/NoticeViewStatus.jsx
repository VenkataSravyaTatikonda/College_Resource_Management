import React, { useEffect, useState, useCallback } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";
import Loading from "../../components/Loading";
import toast from "react-hot-toast";

const NoticeViewStatus = ({ noticeId, goBack }) => {
  const token = localStorage.getItem("userToken");

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [viewedBy, setViewedBy] = useState([]);

  /* ================= FETCH STATUS ================= */
  const fetchStatus = useCallback(async () => {
    if (!noticeId) return;

    try {
      setLoading(true);

      const res = await axiosWrapper.get(
        `/notice/${noticeId}/views`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(res.data.data.students || []);
      setViewedBy(res.data.data.viewedBy || []);
    } catch (err) {
      toast.error("Failed to load view status");
    } finally {
      setLoading(false);
    }
  }, [noticeId, token]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const isViewed = (studentId) => {
    return viewedBy.some(
      (v) => v.userId && v.userId._id === studentId
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <button
        className="mb-4 text-blue-600 underline"
        onClick={goBack}
      >
        ← Back to Notices
      </button>

      <h2 className="text-xl font-semibold mb-4">
        Notice View Status
      </h2>

      {students.length === 0 ? (
        <p className="text-gray-500">No students found</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Enrollment No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td className="border p-2">
                  {s.enrollmentNo}
                </td>
                <td className="border p-2">
                  {s.firstName} {s.lastName}
                </td>
                <td
                  className={`border p-2 font-semibold ${
                    isViewed(s._id)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {isViewed(s._id) ? "Seen" : "Not Seen"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NoticeViewStatus;
