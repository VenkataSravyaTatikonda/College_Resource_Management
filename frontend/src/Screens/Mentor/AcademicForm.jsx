import React, { useEffect, useState } from "react";
import axiosWrapper from "../../utils/AxiosWrapper";
import { toast } from "react-hot-toast";

const AcademicForm = ({ studentId }) => {
  const token = localStorage.getItem("userToken");
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        const res = await axiosWrapper.get(`/academic/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.data) {
          setSemesters(res.data.data.semesters);
        } else {
          setSemesters([
            {
              semesterNumber: 1,
              academicYear: "",
              subjects: [createEmptySubject()],
            },
          ]);
        }
      } catch {
        setSemesters([
          {
            semesterNumber: 1,
            academicYear: "",
            subjects: [createEmptySubject()],
          },
        ]);
      }
    };

    if (studentId) {
      fetchAcademicData();
    }
  }, [studentId, token]);

  const createEmptySubject = () => ({
    courseCode: "",
    courseName: "",
    credits: 0,
    attendanceMonth1: 0,
    attendanceMonth2: 0,
    attendanceMonth3: 0,
    attendanceFinal: 0,
    aat1: 0,
    aat2: 0,
    mid1: 0,
    mid2: 0,
    cie: 0,
    see: 0,
    total: 0,
    grade: "",
  });

  /* ================= HANDLERS ================= */

  const handleSubjectChange = (semIndex, subIndex, field, value) => {
    const updated = [...semesters];

    updated[semIndex].subjects[subIndex][field] =
      field === "courseCode" || field === "courseName" ? value : Number(value);

    setSemesters(updated);
  };

  const handleSemesterChange = (semIndex, field, value) => {
    const updated = [...semesters];
    updated[semIndex][field] = value;
    setSemesters(updated);
  };

  const addSubject = (semIndex) => {
    const updated = [...semesters];
    updated[semIndex].subjects.push(createEmptySubject());
    setSemesters(updated);
  };

  const removeSubject = (semIndex, subIndex) => {
    const updated = [...semesters];
    updated[semIndex].subjects.splice(subIndex, 1);
    setSemesters(updated);
  };

  const addSemester = () => {
    setSemesters([
      ...semesters,
      {
        semesterNumber: semesters.length + 1,
        academicYear: "",
        subjects: [createEmptySubject()],
      },
    ]);
  };

  /* ================= SAVE ================= */

  const saveAcademicData = async () => {
    console.log("Saving data:", semesters); // Debug log
    try {
      setLoading(true);

      await axiosWrapper.post(
        "/academic/save",
        { semesters },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Academic data saved successfully 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold text-center">Enter Academic Details</h2>

      {semesters.map((semester, semIndex) => (
        <div
          key={semIndex}
          className="border rounded-lg p-6 shadow-md space-y-6"
        >
          <h3 className="text-lg font-semibold">
            Semester {semester.semesterNumber}
          </h3>

          {/* Academic Year */}
          <input
            placeholder="Academic Year (2023-2024)"
            value={semester.academicYear}
            onChange={(e) =>
              handleSemesterChange(semIndex, "academicYear", e.target.value)
            }
            className="border p-2 rounded w-60"
          />

          {/* SUBJECT TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-1">Code</th>
                  <th className="border p-1">Name</th>
                  <th className="border p-1">Credits</th>
                  <th className="border p-1">Att M1</th>
                  <th className="border p-1">Att M2</th>
                  <th className="border p-1">Att M3</th>
                  <th className="border p-1">Att Final</th>
                  <th className="border p-1">AAT1</th>
                  <th className="border p-1">AAT2</th>
                  <th className="border p-1">MID1</th>
                  <th className="border p-1">MID2</th>
                  <th className="border p-1">CIE</th>
                  <th className="border p-1">SEE</th>
                  <th className="border p-1">Remove</th>
                </tr>
              </thead>

              <tbody>
                {semester.subjects.map((subject, subIndex) => (
                  <tr key={subIndex}>
                    <td className="border">
                      <input
                        value={subject.courseCode}
                        onChange={(e) =>
                          handleSubjectChange(
                            semIndex,
                            subIndex,
                            "courseCode",
                            e.target.value,
                          )
                        }
                        className="w-full p-1"
                      />
                    </td>

                    <td className="border">
                      <input
                        value={subject.courseName}
                        onChange={(e) =>
                          handleSubjectChange(
                            semIndex,
                            subIndex,
                            "courseName",
                            e.target.value,
                          )
                        }
                        className="w-full p-1"
                      />
                    </td>

                    <td className="border">
                      <input
                        type="number"
                        value={subject.credits}
                        onChange={(e) =>
                          handleSubjectChange(
                            semIndex,
                            subIndex,
                            "credits",
                            e.target.value,
                          )
                        }
                        className="w-full p-1"
                      />
                    </td>

                    {[
                      "attendanceMonth1",
                      "attendanceMonth2",
                      "attendanceMonth3",
                      "attendanceFinal",
                      "aat1",
                      "aat2",
                      "mid1",
                      "mid2",
                      "cie",
                      "see",
                    ].map((field) => (
                      <td key={field} className="border">
                        <input
                          type="number"
                          value={subject[field]}
                          onChange={(e) =>
                            handleSubjectChange(
                              semIndex,
                              subIndex,
                              field,
                              e.target.value,
                            )
                          }
                          className="w-full p-1"
                        />
                      </td>
                    ))}

                    <td className="border">
                      <button
                        onClick={() => removeSubject(semIndex, subIndex)}
                        className="bg-red-500 text-white px-2 rounded"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={() => addSubject(semIndex)}
            className="bg-green-500 text-white px-4 py-1 rounded"
          >
            + Add Subject
          </button>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={addSemester}
          className="bg-purple-500 text-white px-6 py-2 rounded"
        >
          + Add Semester
        </button>

        <button
          onClick={saveAcademicData}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default AcademicForm;
