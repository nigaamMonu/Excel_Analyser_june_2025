import {  useContext, useState } from 'react';

// react-icons
import { MdLockReset } from "react-icons/md";
import { LuEyeClosed,LuEye } from "react-icons/lu";
import { RiLockPasswordLine } from "react-icons/ri";


import axios from 'axios';
import {AppContext} from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email,setEmail]=useState("");
  const navigate=useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword]=useState(false);

  const {backEndUrl} = useContext(AppContext);


  const handleSubmitForSendingResetPasswordOtp= async (e)=>{
    try{
      e.preventDefault();
      axios.defaults.withCredentials = true;
      const {data} =await axios.post(`${backEndUrl}/api/auth/send-reset-otp`,{email:email});

      if(data.success){
        setEmailSent(true);
        toast.success("Otp sent to your email, please check your inbox.");
      }
      else{
        setEmailSent(false);
        toast.error(data.message || "Something went wrong, please try again later.");
      }

    }catch(err){
      toast.error(err.message || "Something went wrong, please try again later.");
    }
  }

  const handlerForResetPassword=async(e)=>{
    try{
      e.preventDefault();
      axios.defaults.withCredentials = true;
      const {data}=await axios.post(`${backEndUrl}/api/auth/reset-password`,{otp,newPassword,email});


      if(data.success){
        toast.success("Password changed successfully, you can now login with your new password.");
        setEmailSent(false);
        setOtp("");
        setNewPassword("");
        navigate('/login');
        
      }else{
        toast.error(data.message || "Something went wrong, please try again later.");
      }
    }catch(err){
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong, please try again later.";
      toast.error(errorMessage);
    }
  }



  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10 transition-all duration-500">
    {!emailSent ? (
      <form
        onSubmit={handleSubmitForSendingResetPasswordOtp}
        className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full transition-all duration-500"
      >
        <div className="flex items-center gap-3 mb-6">
          <MdLockReset className="text-blue-600 text-3xl animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-700">
            Reset Password
          </h2>
        </div>

        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          onChange={(e)=>setEmail(e.target.value)}
          type="email"
          required
          name="email"
          id="email"
          placeholder="Enter your registered email"
          value={email}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Get OTP
        </button>
      </form>
    ) : (
      <form
        onSubmit={handlerForResetPassword}
        className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full transition-all duration-500"
      >
        <div className="flex items-center gap-3 mb-6">
          <RiLockPasswordLine className="text-green-600 text-3xl animate-pulse" />
          <h2 className="text-2xl font-semibold text-gray-700">
            Create New Password
          </h2>
        </div>

        <input
          onChange={(e) => setOtp(e.target.value)}
          type="text"
          placeholder="Enter OTP"
          name="otp"
          value={otp}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 mb-4"
        />

        <div className="relative">
          <input
            onChange={(e) => setNewPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            required
            name="newPassword"
            placeholder="New Password"
            value={newPassword}
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 cursor-pointer transition-colors duration-300 hover:text-green-600"
          >
            {showPassword ? <LuEye /> : <LuEyeClosed />}
          </span>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Change Password
        </button>
      </form>
    )}
  </div>
);

}

export default ResetPassword
