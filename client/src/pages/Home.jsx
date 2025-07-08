import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Home = () => {
  const { userData, backEndUrl } = useContext(AppContext);
  const [files, setFiles] = useState([]);
  const [charts, setCharts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backEndUrl}/api/excel/all`);
        if (data.success) {
          setFiles(data.files);
        }else{
          toast.error(data.message);
        }
      } catch (error) {
        toast.error( error.message || "Failed to fetch files.");
      }
    };

    fetchFiles();
  }, [backEndUrl]);

  const handleDelete = async (id) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.delete(`${backEndUrl}/api/excel/${id}`);
      if (data.success) {
        toast.success("File deleted successfully.");
        setFiles((prev) => prev.filter((f) => f._id !== id));
      }
    } catch (err) {
      toast.error("Error deleting file.");
    }
  };

  return (
    <>
    
    <Navbar/> 
    
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 pt-10 pb-20">
      <div className="flex justify-center items-center flex-col ">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        Welcome back, {userData?.name || "User"} 👋
      </h1>
      <p className="text-gray-600 mb-10 text-sm sm:text-base">
        Here’s your Excel dashboard overview
      </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-all">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Upload Excel File</h2>
          <p className="text-sm text-gray-500 mb-3">Import new data for analysis</p>
          <button
            onClick={() => navigate("/upload")}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Upload Now
          </button>
        </div>
        <div className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-center items-center">
          <h3 className="text-4xl font-bold text-indigo-600">{charts.length}</h3>
          <p className="text-gray-600 text-sm">Charts Created</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-center items-center">
          <h3 className="text-4xl font-bold text-violet-600">{files.length}</h3>
          <p className="text-gray-600 text-sm">Files Uploaded</p>
        </div>
      </div>

      {/* Recent Files */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Recent Files</h2>
          <button
            onClick={() => navigate("/upload")}
            className="text-blue-600 hover:underline text-sm"
          >
            + Upload
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3">File Name</th>
                <th className="p-3">Date Uploaded</th>
                <th className="p-3">Size</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.length === 0 ? (
                <tr>
                  <td className="p-3" colSpan="4">No files uploaded yet.</td>
                </tr>
              ) : (
                files.map((file) => (
                  <tr key={file._id} className="border-b">
                    <td className="p-3 font-medium">{file.fileName}</td>
                    <td className="p-3">{new Date(file.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">{file.sizeKB?.toFixed(2)} KB</td>
                    <td className="p-3 space-x-3">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => navigate(`/analyze/${file._id}`)}
                      >
                        Analyze
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDelete(file._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Charts */}



    </div>
    <Footer/>
    </>
  );
};

export default Home;
