import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Timetable from "./Timetable";
import Material from "./Material";
import Profile from "./Profile";
import Exam from "../Exam";
import ViewMarks from "./ViewMarks";
import { useNavigate, useLocation } from "react-router-dom";
import TNP from "../TNP/TNP";
import MyApplications from "./MyApplications";
import MentorTab from "../Mentor/MentorTab";


const MENU_ITEMS = [
  { id: "home", label: "Home" },
  { id: "timetable", label: "Timetable", component: Timetable },
  { id: "material", label: "Material", component: Material },
  { id: "notice", label: "Notice", component: Notice },
  { id: "exam", label: "Exam", component: Exam },
  { id: "marks", label: "Marks", component: ViewMarks },
  { id: "tnp", label: "TnP" },
  {id:"applications", label:"MyApplications"},
  {id:"mentor", label:"Mentor", component: MentorTab},

];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");
  const location = useLocation();
  const navigate = useNavigate();

  /* ================= FETCH STUDENT DETAILS ================= */
  const fetchUserDetails = useCallback(async () => {
    if (!userToken) return;

    setIsLoading(true);

    try {
      const response = await axiosWrapper.get("/student/my-details", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error fetching user details"
      );
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, userToken]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  /* ================= URL SYNC ================= */
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const page = urlParams.get("page") || "home";

    const validMenu = MENU_ITEMS.find((item) => item.id === page);
    setSelectedMenu(validMenu ? validMenu.id : "home");
  }, [location.search]);

  /* ================= MENU STYLE ================= */
  const getMenuItemClass = (menuId) => {
    return `text-center px-6 py-3 cursor-pointer font-medium text-sm w-full rounded-md transition-all duration-300 ${
      selectedMenu === menuId
        ? "bg-blue-500 text-white shadow-md"
        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
    }`;
  };

  /* ================= HANDLE MENU CLICK ================= */
  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    navigate(`/student?page=${menuId}`);
  };

  /* ================= RENDER CONTENT ================= */
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64 text-gray-500">
          Loading...
        </div>
      );
    }

    if (selectedMenu === "home" && profileData) {
      return <Profile profileData={profileData} />;
    }

    if (selectedMenu === "tnp") {
      return <TNP role="student" />;
    }

    if(selectedMenu ==="applications"){
      return <MyApplications/>;
    }

    /*const menuItem = MENU_ITEMS.find(
      (item) => item.id === selectedMenu
    );*/

      if(selectedMenu === "mentor"){
        return <MentorTab role="student" studentId={profileData?._id} />;
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
              onClick={() => handleMenuClick(item.id)}
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
