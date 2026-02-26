import React, { useEffect, useState } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";
import toast from "react-hot-toast";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [offerFile, setOfferFile] = useState(null);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const res = await axiosWrapper.get("/tnp/my-applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load applications");
    }
  };

  const uploadOffer = async (applicationId) => {
    if (!offerFile) {
      toast.error("Select offer file first");
      return;
    }

    try {
      const data = new FormData();
      data.append("offer", offerFile);

      await axiosWrapper.post(`/tnp/offer/${applicationId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Offer uploaded successfully 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  if (applications.length === 0) {
    return <div className="p-6 text-gray-500">No applications found</div>;
  }

  return (
    <div className="p-6 space-y-4">
      {applications.map((app) => (
        <div key={app._id} className="bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg">
            {app.driveId?.companyName || "Drive Deleted"}
          </h3>

          <p>Role: {app.driveId?.role || "N/A"}</p>

          <p>
            Status:{" "}
            <span
              className={
                app.status === "selected"
                  ? "text-green-600 font-semibold"
                  : "text-yellow-600"
              }
            >
              {app.status}
            </span>
          </p>

          {app.status === "selected" && (
            <div className="mt-3 space-y-2">
              <div className="text-green-600 font-semibold">
                🎉 You are selected!
              </div>

              <input
                type="file"
                onChange={(e) => setOfferFile(e.target.files[0])}
              />

              <button
                onClick={() => uploadOffer(app._id)}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Upload Offer Letter
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyApplications;
