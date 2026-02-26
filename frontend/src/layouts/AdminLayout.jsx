import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
  return (
    <>
      <div>
        <Navbar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
