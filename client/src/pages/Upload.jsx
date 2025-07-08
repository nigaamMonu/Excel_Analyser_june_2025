import { useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";


import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";

import { FiUploadCloud } from "react-icons/fi";

const Upload = () => {
  const { backEndUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [fileId, setFileId] = useState("");

  const fileInputRef=useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && (selected.name.endsWith(".xls") || selected.name.endsWith(".xlsx"))) {
      setFile(selected);
    } else {
      toast.error("Only .xls or .xlsx files are allowed");
      e.target.value = null;
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.warning("Please select a valid Excel file.");

    axios.defaults.withCredentials = true; // to allow cookies to be sent with requests
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const {data} = await axios.post(`${backEndUrl}/api/excel/upload`, formData);
      if (data.success) {
        toast.success("File uploaded successfully!");

        // Now fetch the latest file for the logged-in user
        const fileListRes = await axios.get(`${backEndUrl}/api/excel/all`);

        const latestFile = fileListRes.data.files[fileListRes.data.files.length - 1]; // get the last one
        setFileData(latestFile.data);
        setFileId(latestFile._id);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message || "Upload failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white px-4 py-10 flex flex-col items-center">
        {/* Upload Card */}
        <div className="bg-white w-full max-w-4xl p-8 rounded-2xl shadow-2xl border border-indigo-200 mb-10 transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <FiUploadCloud className="text-4xl text-indigo-600" />
            <h2 className="text-2xl font-bold text-indigo-700">Upload Excel File</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5 transition-all">
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full sm:w-2/3 transition-all"
            />
            <button
              onClick={handleUpload}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium px-6 py-2 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Upload
            </button>
          </div>

          {file && (
            <p className="mt-4 text-sm text-gray-600">
              Selected File: <span className="font-medium text-indigo-700">{file.name}</span>
            </p>
          )}
        </div>

        {/* Preview Card to be added below here */}
        {fileData.length > 0 && (
          <div className="bg-white w-full max-w-6xl p-6 rounded-2xl shadow-lg border border-gray-200 transition-all">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">Uploaded File Preview</h2>
            <div className="overflow-auto max-h-[400px] border rounded-md">
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-indigo-600 text-white sticky top-0">
                  <tr>
                    {Object.keys(fileData[0]).map((key, idx) => (
                      <th key={idx} className="px-4 py-2 border text-left text-sm font-medium">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fileData.map((row, idx) => (
                    <tr key={idx} className="even:bg-gray-100">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="px-4 py-2 border text-sm text-gray-700">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => navigate(`/analyze/${fileId}`)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md active:scale-95 transition"
              >
                Analyze Data
              </button>
              <button onClick={()=>{
                setFile(null);
                setFileData([]);
                setFileId("");
                if(fileInputRef.current){
                  fileInputRef.current.value = null;
                }
              }}
               className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-xl shadow-md active:scale-95 transition  ">
                upload more
                <FiUploadCloud className="inline-block ml-2 text-lg" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Upload;
