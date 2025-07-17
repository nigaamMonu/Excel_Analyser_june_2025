import { useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdminUserDetails from "../components/AdminUserDetails";
import AdminFiles from "../components/AdminFiles";
import AdminCharts from "../components/AdminCharts";

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("users");
  return (
    <div>
      <Navbar />

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <div className="w-full md:w-1/5 bg-gray-800 text-white flex md:flex-col gap-2 px-4 py-6">
          <button
            className={`p-2 rounded ${
              selectedTab === "users" ? "bg-blue-600" : ""
            } cursor-pointer`}
            onClick={() => setSelectedTab("users")}
          >
            Users
          </button>
          <button
            className={`p-2 rounded ${
              selectedTab === "files" ? "bg-blue-600" : ""
            } cursor-pointer`}
            onClick={() => setSelectedTab("files")}
          >
            Files
          </button>
          <button
            className={`p-2 rounded ${
              selectedTab === "charts" ? "bg-blue-600" : ""
            } cursor-pointer`}
            onClick={() => setSelectedTab("charts")}
          >
            Charts
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gray-100 p-4 sm:p-6 overflow-auto">
          {selectedTab === "users" && <AdminUserDetails />}
          {selectedTab === "files" && <AdminFiles />}
          {selectedTab === "charts" && <AdminCharts />}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
