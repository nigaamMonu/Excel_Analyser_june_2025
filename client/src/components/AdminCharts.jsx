import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const AdminCharts = () => {
  const { backEndUrl } = useContext(AppContext);
  const [charts, setCharts] = useState([]);

  const getAllCharts = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backEndUrl}/api/chart/admin-all`);
     
      if (data.success) {
        setCharts(data.charts);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getAllCharts();
  }, []);


  const handleDeleteChart = async (chartId)=>{
    try{
      axios.defaults.withCredentials = true;
      const {data} = await axios.delete(`${backEndUrl}/api/chart/admin/delete/${chartId}`);
      if(data.success){
        toast.success(data.message);
        setCharts((prev)=>{
          return prev.filter((chart)=>chart._id !== chartId);
        });
      }else{
        toast.error(data.message);
      }
    }catch(err){
      toast.error(err.message || "Failed to delete chart.");
    }
  }

  return (
    <div className="w-full h-full p-4 overflow-x-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">All Saved Charts</h2>
        <p className="text-sm text-gray-500">List of all charts created by users</p>
      </div>
      <div className="bg-white rounded-lg shadow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Chart Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Chart Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">X-Axis</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Y-Axis</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Created At</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {charts.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-gray-600" colSpan="5">
                  No charts found.
                </td>
              </tr>
            ) : (
              charts.map((chart) => (
                <tr key={chart._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800 font-medium">{chart.fileName}</td>
                  <td className="px-4 py-3 text-gray-700">{chart.chartType}</td>
                  <td className="px-4 py-3 text-gray-700">{chart.xAxis}</td>
                  <td className="px-4 py-3 text-gray-700">{chart.yAxis}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(chart.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-4 py-3 text-red-800 hover:underline hover:text-red-600 cursor-pointer"  onClick={()=>{handleDeleteChart(chart._id)}}>Delete</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCharts;
