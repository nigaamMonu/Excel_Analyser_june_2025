import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import jsPDF from "jspdf";


import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

import { FaRegLaughWink } from "react-icons/fa";
import { LiaSadCry } from "react-icons/lia";
import { MdClose } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";

const Home = () => {
  const { userData, backEndUrl } = useContext(AppContext);
  const [files, setFiles] = useState([]);
  const [charts, setCharts] = useState([]);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [currentFileId, setCurrentFileId] = useState("");

  const [selectedChart, setSelectedChart] = useState(null);
  const [chartPopupOpen, setChartPopupOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backEndUrl}/api/excel/all`);
        if (data.success) {
          setFiles(data.files);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch files.");
      }
    };

    fetchFiles();
    fetchCharts();
  }, [backEndUrl]);


  const fetchCharts = async () => {
  try {
    const { data } = await axios.get(`${backEndUrl}/api/chart/user-all`, {
      withCredentials: true,
    });
    if (data.success) setCharts(data.charts);
  } catch (error) {
    toast.error("Failed to fetch charts");
  }
  };

  const handleDelete = async (id) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.delete(`${backEndUrl}/api/excel/${id}`);
      if (data.success) {
        toast.success("File deleted successfully.");
        setFiles((prev) => prev.filter((f) => f._id !== id));
        setCharts((prev)=>prev.filter((chart)=>chart.fileId!==id));
      }
    } catch (err) {
      toast.error("Error deleting file.");
    }
  };

  const toggleDeletePopUp = () => {
    setDeletePopUp(!deletePopUp);
  };


  const downloadRenderedChart = (type) => {
    const canvas = document.querySelector("#homeChart canvas");
    if (!canvas) return toast.error("Chart not rendered yet.");

    const imageURL = canvas.toDataURL("image/png");

    if (type === "png") {
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = imageURL;
      link.click();
    } else if (type === "pdf") {
      const pdf = new jsPDF({
        orientation: "landscape",
       unit: "px",
       format: [canvas.width, canvas.height],
      });
      pdf.addImage(imageURL, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("chart.pdf");
    }
  };

  const openChartPopup = async (chart) => {
    try {
      const { data } = await axios.get(`${backEndUrl}/api/excel/${chart.fileId}`, {
        withCredentials: true,
      });

      const fileData = data.file?.data || [];

      setSelectedChart({ ...chart, fileData });
      setChartPopupOpen(true);
    } catch (err) {
      toast.error("Failed to fetch chart file data.");
    }
  };

  const handleChartDelete = async (chartId) => {
    try{
      axios.defaults.withCredentials=true;
      const {data} = await axios.delete(`${backEndUrl}/api/chart/delete/${chartId}`);

      if(data.success){
        toast.success("Chart deleted successfully.");
        setCharts((prev) => prev.filter((c) => c._id !== chartId));
      }else {
        toast.error(data.message || "Failed to delete chart.");
      }
    }catch(err){
      toast.error(err.message);
    }
  }



  return (
    <>
      <Navbar />

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
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Upload Excel File
            </h2>
            <p className="text-sm text-gray-500 mb-3">
              Import new data for analysis
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Upload Now
            </button>
          </div>
          <div className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-center items-center">
            <h3 className="text-4xl font-bold text-indigo-600">
              {charts.length}
            </h3>
            <p className="text-gray-600 text-sm">Charts Created</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-5 flex flex-col justify-center items-center">
            <h3 className="text-4xl font-bold text-violet-600">
              {files.length}
            </h3>
            <p className="text-gray-600 text-sm">Files Uploaded</p>
          </div>
        </div>

        {/* Recent Files */}
        <div className="bg-white max-h-[300px] overflow-hidden  shadow-md rounded-xl p-6 mb-12">
          <div className="sticky flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Recent Files
            </h2>
            <button
              onClick={() => navigate("/upload")}
              className="text-blue-600 hover:underline text-sm cursor-pointer"
            >
              + Upload
            </button>
          </div>
          <div className="overflow-y-auto max-h-[240px] px-6 pb-4">
            <table className="table-auto w-full text-sm text-left">
              <thead className="sticky top-0 bg-white z-10 border-b border-gray-200 text-gray-600">
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
                    <td className="p-3" colSpan="4">
                      No files uploaded yet.
                    </td>
                  </tr>
                ) : (
                  files.map((file) => (
                    <tr key={file._id} className="border-b">
                      <td className="p-3 font-medium">{file.fileName}</td>
                      <td className="p-3">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">{file.sizeKB?.toFixed(2)} KB</td>
                      <td className="p-3 space-x-3">
                        <button
                          className="text-blue-600 hover:underline cursor-pointer"
                          onClick={() => navigate(`/analyze/${file._id}`)}
                        >
                          Analyze
                        </button>
                        <button
                          className="text-red-500 hover:underline cursor-pointer"
                          // onClick={() => handleDelete(file._id)}
                          onClick={() => {
                            setCurrentFileId(file._id);
                            toggleDeletePopUp();
                          }}
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

        {deletePopUp && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-55">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-80 relative">
              <button
                onClick={toggleDeletePopUp}
                className="absolute top-3 right-3 text-gray-600 hover:text-red-500 cursor-pointer"
              >
                <MdClose size={24} />
              </button>
              <h3 className="text-lg font-semibold text-indigo-600 mb-4">
                Are you sure you want to delete this file?
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={toggleDeletePopUp}
                  className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
                >
                  just Kidding <FaRegLaughWink className="inline-block ml-1" />
                </button>
                <button
                  onClick={() => {
                    handleDelete(currentFileId);
                    toggleDeletePopUp();
                    setCurrentFileId("");
                  }}
                  className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                >
                  Delete <LiaSadCry className="inline-block ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Charts */}
        <div className="bg-white max-h-[300px] overflow-hidden shadow-md rounded-xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Charts
          </h2>
          <div className="overflow-y-auto max-h-[240px] px-6 pb-4">
            <table className="table-auto w-full text-sm text-left">
              <thead className="sticky top-0 bg-white z-10 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="p-3">Chart Name</th>
                  <th className="p-3">Saved Date</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Delete</th>
                </tr>
              </thead>
              <tbody>
                {charts.length === 0 ? (
                  <tr>
                    <td className="p-3" colSpan="2">
                      No charts created yet.
                    </td>
                  </tr>
                ) : (
                  charts.map((chart) => (
                    <tr key={chart._id} className="border-b">
                      <td className="p-3 font-medium">{chart.fileName}</td>
                      <td>{new Date(chart.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <button
                         onClick={() => {
                            openChartPopup(chart);
                          }}
                          className="text-indigo-600 hover:underline cursor-pointer"
                        >
                          View Chart
                        </button>
                      </td>
                      <td onClick={()=> handleChartDelete(chart._id)} className="p-3 cursor-pointer text-red-800  hover:text-red-600"><MdDeleteSweep size={24}/> </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Chart Preview Popup */}
{chartPopupOpen && selectedChart && (
  <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-3xl w-full relative">
      <button
        onClick={() => setChartPopupOpen(false)}
        className="absolute top-3 right-3 text-gray-600 hover:text-red-500 cursor-pointer"
      >
        <MdClose size={24} />
      </button>

      <h2 className="text-xl font-semibold text-indigo-600 mb-4">{selectedChart.fileName}</h2>

      <div id="homeChart" className="mb-6">
        {(() => {
          const chartData = {
            labels: selectedChart.fileData?.map(row => row[selectedChart.xAxis]),
            datasets: [
              {
                label: `${selectedChart.xAxis} vs ${selectedChart.yAxis}`,
                data: selectedChart.fileData?.map(row => row[selectedChart.yAxis]),
                backgroundColor: "rgba(99, 102, 241, 0.6)",
                borderColor: "rgba(99, 102, 241, 1)",
                borderWidth: 1,
              },
            ],
          };

          switch (selectedChart.chartType) {
            case "Bar": return <Bar data={chartData} />;
            case "Line": return <Line data={chartData} />;
            case "Pie": return <Pie className="max-h-70"  data={chartData} />;
            case "Doughnut": return <Doughnut className="max-h-70" data={chartData} />;
            default: return <p className="text-gray-500">Unsupported Chart Type</p>;
          }
        })()}
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={() => downloadRenderedChart("png")}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Download PNG
        </button>
        <button
          onClick={() => downloadRenderedChart("pdf")}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  </div>
)}

      <Footer />
    </>
  );
};

export default Home;
