import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";

import Notice from "../Notice";
import NoticeViewStatus from "./NoticeViewStatus";
import Timetable from "./Timetable";
import Material from "./Material";
import StudentFinder from "./StudentFinder";
import Profile from "./Profile";
import Marks from "./AddMarks";
import Exam from "../Exam";
import TNP from "../TNP/TNP";
import MentorTab from "../Mentor/MentorTab";
import AcademicView from "../Mentor/AcademicView";

const MENU_ITEMS = [
  { id: "home", label: "Home" },
  { id: "timetable", label: "Timetable" },
  { id: "material", label: "Material" },
  { id: "notice", label: "Notice" },
  { id: "student info", label: "Student Info" },
  { id: "marks", label: "Marks" },
  { id: "exam", label: "Exam" },
  { id: "tnp", label: "TnP" },
  { id: "mentor", label: "Mentor" },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");

  /* ================= LOAD FACULTY PROFILE ================= */
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosWrapper.get("/faculty/my-details", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.success) {
          setProfileData(response.data.data);
          dispatch(setUserData(response.data.data));
        }
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };

    if (userToken) {
      fetchUserDetails();
    }
  }, [dispatch, userToken]);

  /* ================= MENU STYLE ================= */
  const getMenuItemClass = (menuId) => {
    return `text-center px-6 py-3 cursor-pointer font-medium text-sm w-full rounded-md ${
      selectedMenu === menuId
        ? "bg-blue-500 text-white"
        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
    }`;
  };

  /* ================= RENDER CONTENT ================= */
  const renderContent = () => {
    if (selectedMenu === "home" && profileData) {
      return <Profile profileData={profileData} />;
    }

    if (selectedMenu === "timetable") return <Timetable />;
    if (selectedMenu === "material") return <Material />;

    /* ===== STUDENT FINDER ===== */
    if (selectedMenu === "student info") {
      return (
        <StudentFinder
          setSelectedStudentId={setSelectedStudentId}
          setSelectedMenu={setSelectedMenu}
        />
      );
    }

    if (selectedMenu === "marks") return <Marks />;
    if (selectedMenu === "exam") return <Exam />;
    if (selectedMenu === "tnp") return <TNP role="faculty" />;

    /* ===== NOTICE LIST ===== */
    if (selectedMenu === "notice") {
      return (
        <Notice
          role="faculty"
          setSelectedMenu={setSelectedMenu}
          setSelectedNoticeId={setSelectedNoticeId}
        />
      );
    }
          

    /* ===== NOTICE VIEW STATUS ===== */
    if (selectedMenu === "notice-status") {
      return (
        <NoticeViewStatus
          noticeId={selectedNoticeId}
          goBack={() => {
            setSelectedNoticeId(null);
            setSelectedMenu("notice");
          }}
        />
      );
    }

    /* ===== MENTOR TAB ===== */
    if (selectedMenu === "mentor") {
      if (!selectedStudentId) {
        return (
          <div className="text-center mt-10 text-lg text-gray-600">
            Please select a student first from Student Info.
          </div>
        );
      }

      return <MentorTab role="faculty" studentId={selectedStudentId} setSelectedMenu={setSelectedMenu} />;
    }

    /* ===== ACADEMIC VIEW ===== */
    if (selectedMenu === "academic") {
      if (!selectedStudentId) {
        return (
          <div className="text-center mt-10 text-lg text-gray-600">
            Please select a student first.
          </div>
        );
      }

      return <AcademicView studentId={selectedStudentId} />;
    }


    return null;
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto">
        {/* ===== MENU ===== */}
        <ul className="flex justify-evenly items-center gap-8 w-full mx-auto my-8">
          {MENU_ITEMS.map((item) => (
            <li
              key={item.id}
              className={getMenuItemClass(item.id)}
              onClick={() => {
                setSelectedMenu(item.id);
                setSelectedNoticeId(null);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>

        {/* ===== CONTENT ===== */}
        {renderContent()}
      </div>

      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;
