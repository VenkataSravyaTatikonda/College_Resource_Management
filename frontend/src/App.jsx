import React from "react";
//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import FacultyLayout from "./layouts/FacultyLayout";
import StudentLayout from "./layouts/StudentLayout";

import Login from "./Screens/Auth/Login";
import Register from "./Screens/Auth/Register";
import ForgotPassword from "./Screens/Auth/ForgotPassword";
import ResetPassword from "./Screens/Auth/ResetPassword";

import Dashboard from "./Screens/Dashboard";
import Profile from "./Screens/Profile";
import Notice from "./Screens/Notice";

import Student from "./Screens/Admin/Student";
import Faculty from "./Screens/Admin/Faculty";
import Subject from "./Screens/Admin/Subject";
import Branch from "./Screens/Admin/Branch";

import UploadMarks from "./Screens/Faculty/UploadMarks";
import NoticeViewStatus from "./Screens/Faculty/NoticeViewStatus";

import AcademicView from "./Screens/Mentor/AcademicView"; // ✅ Important

const App = () => {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ================= ADMIN ================= */}
        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="student" element={<Student />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="subject" element={<Subject />} />
          <Route path="branch" element={<Branch />} />
          <Route path="notices" element={<Notice />} />
          <Route path="academic/:studentId" element={<AcademicView />} />
        </Route>

        {/* ================= FACULTY ================= */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute>
              <FacultyLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="notices" element={<Notice />} />
          <Route path="upload-marks" element={<UploadMarks />} />
          <Route path="notice/:id/views" element={<NoticeViewStatus />} />
          <Route path="academic/:studentId" element={<AcademicView />} />
        </Route>
        {/* ================= STUDENT ================= */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentLayout>
                <Dashboard />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/notices"
          element={
            <ProtectedRoute>
              <StudentLayout>
                <Notice />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        {/* ================= PROFILE ================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
