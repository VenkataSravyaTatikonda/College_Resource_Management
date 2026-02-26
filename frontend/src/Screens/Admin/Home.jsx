import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import NoticeViewStatus from "../Faculty/NoticeViewStatus";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Profile from "./Profile";
import Student from "./Student";
import Faculty from "./Faculty";
import Branch from "./Branch";
import Subject from "./Subject";
import Exam from "../Exam";
import TNP from "../TNP/TNP";
import MentorTab from "../Mentor/MentorTab";
//import AcademicView from "../Mentor/AcademicView";
const MENU_ITEMS = [
  { id: "home", label: "Home" },
  { id: "student", label: "Student", component: Student },
  { id: "faculty", label: "Faculty", component: Faculty },
  { id: "branch", label: "Branch", component: Branch },
  { id: "subject", label: "Subject", component: Subject },
  { id: "notice", label: "Notice" },
  { id: "exam", label: "Exam", component: Exam },
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

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axiosWrapper.get("/admin/my-details", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.success) {
          setProfileData(response.data.data);
          dispatch(setUserData(response.data.data));
        }
      } catch {
        toast.error("Failed to load admin profile");
      }
    };

    if (userToken) {
      fetchAdminDetails();
    }
  }, [dispatch, userToken]);

  const renderContent = () => {
    if (selectedMenu === "home" && profileData) {
      return <Profile profileData={profileData} />;
    }

    if (selectedMenu === "notice") {
      return (
        <Notice
          setSelectedMenu={setSelectedMenu}
          setSelectedNoticeId={setSelectedNoticeId}
        />
      );
    }

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

    if (selectedMenu === "tnp") {
      return <TNP role="admin" />;
    }

    if (selectedMenu === "student") {
  return (
    <Student
      setSelectedStudentId={setSelectedStudentId}
      setSelectedMenu={setSelectedMenu}
    />
  );
}

if (selectedMenu === "mentor") {
  if (!selectedStudentId) {
    return (
      <div className="text-center mt-10 text-lg text-gray-600">
        Please select a student first from Student section.
      </div>
    );
  }

  return (
    <MentorTab
      role="admin"
      studentId={selectedStudentId}
    />
  );
}

const menuItem = MENU_ITEMS.find((item) => item.id === selectedMenu);

if (menuItem && menuItem.component) {
  const Component = menuItem.component;
  return <Component />;
}

    return null;
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto">
        <ul className="flex justify-evenly items-center gap-6 w-full mx-auto my-8">
          {MENU_ITEMS.map((item) => (
            <li
              key={item.id}
              className={`px-6 py-3 cursor-pointer font-medium text-sm rounded-md ${
                selectedMenu === item.id
                  ? "bg-blue-500 text-white"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
              onClick={() => {
                setSelectedMenu(item.id);
                setSelectedNoticeId(null);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>

        {renderContent()}
      </div>

      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;
