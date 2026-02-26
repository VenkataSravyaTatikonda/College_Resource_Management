import { useState, useEffect } from "react";
import { useCallback } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";
import ApplicationList from "./ApplicationList";
import toast from "react-hot-toast";

const DriveCard = ({ drive, role, refreshDrives }) => {
  const token = localStorage.getItem("userToken");

  const [showApps, setShowApps] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [offerFile, setOfferFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [applied, setApplied] = useState(false);
  const [status, setStatus] = useState("");

  const [formData, setFormData] = useState({
    companyName: drive.companyName,
    role: drive.role,
    deadline: drive.deadline?.split("T")[0],
    applyLink: drive.applyLink,
  });

  /* ================= CHECK APPLICATION ================= */
  

  const checkApplication = useCallback(async () => {
    try {
      const res = await axiosWrapper.get(
        `/tnp/check-application/${drive._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.applied) {
        setApplied(true);
        setStatus(res.data.status);
      }
    } catch (err) {
      console.log(err);
    }
  },[drive._id,token]);

  useEffect(() => {
    if (role === "student") {
      checkApplication();
    }
  }, [role,checkApplication]);

  /* ================= APPLY ================= */
  const applyDrive = async () => {
    if (!resumeFile) {
      toast.error("Please upload resume first");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      data.append("resume", resumeFile);

      await axiosWrapper.post(
        `/tnp/apply/${drive._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Applied successfully 🎉");
      setApplied(true);
      setStatus("applied");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error applying");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPLOAD OFFER ================= */
  const uploadOffer = async () => {
    if (!offerFile) {
      toast.error("Upload offer letter first");
      return;
    }

    try {
      const data = new FormData();
      data.append("offer", offerFile);

      await axiosWrapper.post(
        `/tnp/offer/${drive._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Offer uploaded successfully 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  /* ================= DELETE ================= */
  const deleteDrive = async () => {
    if (!window.confirm("Delete this drive?")) return;

    try {
      await axiosWrapper.delete(`/tnp/drive/${drive._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Drive deleted");
      refreshDrives();
    } catch {
      toast.error("Failed to delete drive");
    }
  };

  /* ================= UPDATE ================= */
  const updateDrive = async () => {
    try {
      await axiosWrapper.put(
        `/tnp/drive/${drive._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Drive updated");
      setEditing(false);
      refreshDrives();
    } catch {
      toast.error("Failed to update drive");
    }
  };

  const isDeadlineOver = new Date(drive.deadline) < new Date();


  return (
    <div className="bg-white p-6 rounded shadow space-y-3">
      {/* ================= EDIT MODE ================= */}
      {editing ? (
        <>
          <input
            className="border p-2 w-full rounded"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
          />

          <input
            className="border p-2 w-full rounded"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
          />

          <input
            type="date"
            className="border p-2 w-full rounded"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
          />

          <input
            className="border p-2 w-full rounded"
            value={formData.applyLink}
            onChange={(e) =>
              setFormData({ ...formData, applyLink: e.target.value })
            }
          />

          <div className="flex gap-3 mt-3">
            <button
              onClick={updateDrive}
              className="bg-blue-600 text-white px-4 py-1 rounded"
            >
              Save
            </button>

            <button
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold">{drive.companyName}</h2>
          <p>Role: {drive.role}</p>
          <p>Deadline: {new Date(drive.deadline).toDateString()}</p>

          {drive.applyLink && (
            <a
              href={drive.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Apply here
            </a>
          )}
        </>
      )}

      {/* ================= STUDENT SECTION ================= */}
      {role === "student" && (
      <div className="mt-4 space-y-2">
         {isDeadlineOver ? (
      <div className="text-red-600 font-semibold">
        Deadline Closed ❌
      </div>
    ) :applied ? (
          <div className="text-green-600 font-semibold">
            Applied ✅
          </div>
        ) : (
          <>
            <input
              type="file"
              onChange={(e) =>
                setResumeFile(e.target.files[0])
              }
            />

            <button
              onClick={applyDrive}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {loading ? "Applying..." : "Apply"}
            </button>
          </>
        )}
     
          {applied && status === "applied" && (
            <div className="text-green-600 font-semibold">
              Applied ✅
            </div>
          )}

          {applied && status === "selected" && (
            <>
              <div className="text-blue-600 font-bold">
                🎉 Selected
              </div>

              <input
                type="file"
                onChange={(e) =>
                  setOfferFile(e.target.files[0])
                }
              />

              <button
                onClick={uploadOffer}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Upload Offer Letter
              </button>
            </>
          )}
        </div>
      )}

      {/* ================= FACULTY / ADMIN ================= */}
      {(role === "faculty" || role === "admin") && (
        <>
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setShowApps(!showApps)}
              className="text-green-600"
            >
              View Applications
            </button>

            <button
              onClick={() => setEditing(true)}
              className="text-blue-600"
            >
              Edit
            </button>

            <button
              onClick={deleteDrive}
              className="text-red-600"
            >
              Delete
            </button>
          </div>

          {showApps && (
            <ApplicationList driveId={drive._id} />
          )}
        </>
      )}
    </div>
  );
};

export default DriveCard;