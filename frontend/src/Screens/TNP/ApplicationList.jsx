import React, { useEffect, useState, useCallback } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";

const ApplicationList = ({ driveId }) => {
  const [apps, setApps] = useState([]);

  const fetchApps = useCallback(async () => {
    const res = await axiosWrapper.get(
      `/tnp/applications/${driveId}`
    );
    setApps(res.data.data);
  }, [driveId]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const markSelected = async (id) => {
    await axiosWrapper.put(`/tnp/select/${id}`);
    fetchApps();
  };

  return (
    <div className="mt-4 border-t pt-4">
      {apps.map((app) => (
        <div key={app._id} className="flex justify-between">
          <span>{app.studentId?.firstName} {app.studentId?.lastNam}</span>
          <span>{app.status}</span>

          {app.status === "applied" && (
            <button
              onClick={() => markSelected(app._id)}
              className="text-green-600"
            >
              Select
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicationList;
