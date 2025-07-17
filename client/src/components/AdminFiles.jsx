import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../context/AppContext";


const AdminFiles = () => {
  const { backEndUrl } = useContext(AppContext);

  const navigate = useNavigate();

  const [files, setFiles] = useState([]);

  const getAllFilesAdmin = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backEndUrl}/api/excel/admin/all`);

      if (data.success) {
        setFiles(data.files);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong while fetching files.");
    }
  };


  const handleDeleteFileAdmin = async (fileId) => {
    try{
      axios.defaults.withCredentials = true;
      const { data } = await axios.delete(`${backEndUrl}/api/excel/${fileId}`);
      if (data.success) {
        toast.success("File deleted successfully.");
        setFiles((prev) => prev.filter((f) => f._id !== fileId));
      }
    }catch(err){
      toast.error(err.message);
    }
  }

  useEffect(() => {
    getAllFilesAdmin();
  }, []);
  return (
    <div className="flex-1 w-full p-4 sm:p-6 overflow-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        Uploaded Files (Admin View)
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full min-w-[600px] text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">File Name</th>
              <th className="px-4 py-3">Date Uploaded</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-center text-gray-500" colSpan="4">
                  No files uploaded yet.
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr key={file._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{file.fileName}</td>
                  <td className="px-4 py-3">
                    {new Date(file.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3">{file.sizeKB?.toFixed(2)} KB</td>
                  <td className="px-4 py-3 space-x-3">
                    <button
                      onClick={() =>{
                        navigate(`/analyze/${file._id}`);
                        scrollTo(0, 0);
                      }}
                      className="text-blue-600 hover:underline font-medium cursor-pointer"
                    >
                      Analyze
                    </button>
                    <button
                      onClick={() => handleDeleteFileAdmin(file._id)}
                      className="text-red-600 hover:underline font-medium cursor-pointer"
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
  );
};

export default AdminFiles;
