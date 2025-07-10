import  { useState, useEffect,useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import jsPDF from "jspdf";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";

import { MdClose } from "react-icons/md";


import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";

const chartTypes2D = ["Bar", "Line", "Pie", "Scatter"];
const chartTypes3D = ["3D Bar", "3D Line"];

const Analyse = () => {
  const { id } = useParams();
  const { backEndUrl } = useContext(AppContext);
  const [fileData, setFileData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("Bar");
  const [chartPopup, setChartPopup] = useState(false);
  const [downloadPopup, setDownloadPopup] = useState(false);
  const [fileName, setFileName] = useState("");
  const [previewOpened, setPreviewOpened] = useState(false);

  useEffect(() => {
    axios
      .get(`${backEndUrl}/api/excel/${id}`, { withCredentials: true })
      .then((res) => {
        setFileData(res.data.file.data);
        setColumns(Object.keys(res.data.file.data[0]).filter((k) => k !== "0"));
      })
      .catch((err) => toast.error("Failed to fetch data"));
  }, [id]);

  const chartData = {
    labels: fileData.map((row) => row[xAxis]),
    datasets: [
      {
        label: `${xAxis} vs ${yAxis}`,
        data: fileData.map((row) => row[yAxis]),
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
      },
    ],
  };

  const saveChart = async () => {
    if (!fileName) return toast.warning("Please provide a file name.");
    try {
      const res = await axios.post(
        `${backEndUrl}/api/chart/save`,
        {
          fileId: id,
          chartType,
          xAxis,
          yAxis,
          fileName,
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error("Failed to save chart");
    }
  };

  const downloadChart = (type) => {
  const canvas = document.querySelector("canvas");
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

  setDownloadPopup(false);
};

  const renderChart = () => {
    switch (chartType) {
      case "Bar":
        return <Bar data={chartData} />;
      case "Line":
        return <Line data={chartData} />;
      case "Pie":
        return <Pie className="max-h-70" data={chartData} />;
      case "Scatter":
        return <Scatter data={chartData} />;
      default:
        return (
          <p className="text-center text-gray-600">3D charts coming soon...</p>
        );
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="flex flex-col justify-center items-center flex-wrap gap-6">
          {/* Left control panel */}
          <div className="w-full md:w-1/2 p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-indigo-600">
              Create Chart & Analyze
            </h2>

            <input
              onChange={(e) => setFileName(e.target.value)}
              type="text"
              value={fileName}
              placeholder="Enter chart name"
              className="w-full p-2 border rounded"
            />

            <select
              onChange={(e) => setChartType(e.target.value)}
              value={chartType}
              className="w-full p-2 border rounded"
            >
              <optgroup label="2D Charts">
                {chartTypes2D.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </optgroup>
              <optgroup label="3D Charts">
                {chartTypes3D.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </optgroup>
            </select>

            <select
              onChange={(e) => setXAxis(e.target.value)}
              value={xAxis}
              className="w-full p-2 border rounded"
            >
              <option value="">Select X-axis</option>
              {columns.map((col) => (
                <option key={col}>{col}</option>
              ))}
            </select>

            <select
              onChange={(e) => setYAxis(e.target.value)}
              value={yAxis}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Y-axis</option>
              {columns.map((col) => (
                <option key={col}>{col}</option>
              ))}
            </select>

            <div className="w-full flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setChartPopup(true)}
                disabled={!xAxis || !yAxis || !fileName}
                className={`w-full md:w-1/2 px-4 py-2 text-center font-semibold rounded-lg transition-all duration-300 ${
                  xAxis && yAxis && fileName
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Analyze
              </button>

              <button
                onClick={() => setPreviewOpened(true)}
                disabled={previewOpened}
                className={`w-full md:w-1/2 px-4 py-2 text-center font-semibold rounded-lg transition-all duration-300 ${
                  !previewOpened
                    ? "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Preview Chart
              </button>
            </div>
          </div>

          {/* Chart preview */}

          {previewOpened && (
            <div className="w-full md:w-2/3 p-6 bg-white rounded-xl shadow-md transition-all duration-500">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">
                Chart Preview
              </h2>
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
            </div>
          )}
        </div>

        {/* Chart popup */}
        {chartPopup && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-3xl w-full relative">
              <button
                onClick={() => setChartPopup(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              >
                <MdClose size={24} />
              </button>

              <div className="mb-6">{renderChart()}</div>

              <div className="flex justify-end gap-4">
                <button
                  onClick={saveChart}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setDownloadPopup(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Download popup */}
        {downloadPopup && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-80 relative">
              <button
                onClick={() => setDownloadPopup(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              >
                <MdClose size={24} />
              </button>
              <h3 className="text-lg font-semibold text-indigo-600 mb-4">
                Download as
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={() => downloadChart("png")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  PNG
                </button>
                <button
                  onClick={() => downloadChart("pdf")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Analyse;
