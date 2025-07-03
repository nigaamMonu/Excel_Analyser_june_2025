import  { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify';

const EmailVerify = () => {
  const {backEndUrl, isLoggedIn, userData, getUserData} =useContext(AppContext);
  const inputRefs = useRef([]);
  const navigate = useNavigate();


  // handelInput function to move focus to the next input field when a character is entered
  const handleInput= (e,index)=>{
    if(e.target.value.length>0 && index < inputRefs.current.length-1){
      inputRefs.current[index + 1].focus();
    }
  }

  // handleKeyDown function to move focus to the previous input field when backspace is pressed and the current input is empty
  const handleKeyDown = (e, index) => {
    if(e.key === 'Backspace' && e.target.value === '' && index > 0){
      inputRefs.current[index -1].focus();
    }
  }



  // handlePaste function to handle pasting of OTP characters
  // It splits the pasted data into an array and fills the input fields with the characters

  const handlePaste= (e)=>{
    const pastedData = e.clipboardData.getData('text');
    const pasteArray = pastedData.split('');
    pasteArray.forEach((char,idx) =>{
      if(inputRefs.current[idx]) {
        inputRefs.current[idx].value = char;
        inputRefs.current[idx].focus();
      }
    })
  }

  // onSubmitHandler function to handle the form submission
  // It collects the values from the input fields, joins them into a string, and sends it to the backend for verification
  // If successful, it navigates to the home page and fetches user data
  const onSubmitHandler = async (e)=>{
    try{
      e.preventDefault();
      const otp= inputRefs.current.map(e=>e.value);
      const otpString = otp.join('');

      axios.defaults.withCredentials=true;
      const {data}= await axios.post(`${backEndUrl}/api/auth/verify-account`,{otp:otpString});

      if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/');
      }else {
        toast.error(data.message || "Something went wrong");
      }

    }catch(err){
      toast.error(err.message || "Something went wrong");
    }
  }

 // useEffect to check if the user is already logged in and has verified their account
 // If so, it redirects them to the home page
  useEffect(()=>{
    userData && isLoggedIn && userData.isAccountVerified && (toast.success("You are already logged in and your account is verified."), navigate('/'));
  },[userData, isLoggedIn]);

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={onSubmitHandler} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Enter your OTP
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          We've sent a One Time Password (OTP) to your email.
        </p>

        <div className="flex justify-center gap-2 mb-6">
          {Array(6).fill(0).map((_, idx) => (
            <input
              key={idx}
              type="text"
              maxLength="1"
              required
              ref={(el) => (inputRefs.current[idx] = el)}
              onInput={(e) => handleInput(e, idx)}
              onKeyDown={(e)=> handleKeyDown(e,idx)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          className="bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
