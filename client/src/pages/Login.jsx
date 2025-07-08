import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { backEndUrl, setIsLoggedIn, getUserData } = useContext(AppContext);


  const [state, setState] = useState("Sign In");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const resetFormData=(e)=>{
    setFormData({
            name: "",
            email: "",
            password: "",
            role: "user",
          })
  }

  const handleState = () => {
    if (state === "Sign Up") {
      setState("Sign In");
    } else {
      setState("Sign Up");
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true; // to allow cookies to be sent with requests
      if (state === "Sign Up") {
        const { data } = await axios.post(
          `${backEndUrl}/api/auth/register`,
          formData
        );

        if (data.success) {
          toast.success("Account created successfully. Please login now.");
          resetFormData();
          navigate("/login");
          setState('Sign In');
        } else {
          toast.error(data.message || "Something went wrong");
        }
      } else {
        const { data } = await axios.post(`${backEndUrl}/api/auth/login`, {
          email: formData.email,
          password: formData.password,
        });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          toast.success("Login successful!");
          navigate("/");
        } else {
          toast.error(data.message || "Something went wrong");
        }
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }
  };

  return (
    <>
     <Navbar />
    
    <div className=" min-h-screen overflow-auto bg-gray-50 flex  items-center justify-center px-4 py-6">

      <div className="flex items-center justify-center w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col gap-4"
        >
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800">
            {state === "Sign Up"
              ? "Create your account"
              : "Login to your account!"}
          </h2>

          {state === "Sign Up" && (
            <input
              type="text"
              placeholder="Your Name"
              name="name"
              onChange={handleChange}
              value={formData.name}
              className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <input
            type="email"
            required
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <input
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              required
              name="password"
              placeholder="Your Password"
              value={formData.password}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 cursor-pointer transition-colors duration-300 hover:text-blue-600"
            >
              {showPassword ? <LuEye /> : <LuEyeClosed />}
            </span>
          </div>

          {state == "Sign Up" && <select
            name="role"
            onChange={handleChange}
            value={formData.role}
            required
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
  }

          <p
            onClick={() => navigate("/reset-password")}
            className="text-sm cursor-pointer  text-gray-600 hover:text-blue-600"
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-xl hover:bg-blue-700 transition duration-200 w-full"
          >
            {state}
          </button>
          <p className="text-sm text-center">
            {state === "Sign Up"
              ? "Already have an account?"
              : `Don't have account?`}{" "}
            <span
              onClick={handleState}
              className="cursor-pointer hover:text-blue-600"
            >
              {state === "Sign Up" ? "Login here" : "Sign Up here"}
            </span>
          </p>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Login;
