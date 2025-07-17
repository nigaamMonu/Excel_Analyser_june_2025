import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { AppContext } from "../context/AppContext";

const AdminUserDetails = () => {

  const { backEndUrl } = useContext(AppContext);
  const [users, setUsers] = useState([]);

  const fetchAllUsers = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backEndUrl}/api/user/admin/all-users`);
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message || "Failed to fetch users.");
      }
    } catch (err) {
      toast.error(err.message || "Error fetching users.");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);


  return (
    <div className="flex-1 w-full p-4 sm:p-6 overflow-auto">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        Registered Users
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full min-w-[500px] text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Registered On</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center px-4 py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role || "user"}</td>
                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUserDetails

