
import { useState, createContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from 'axios';
import {useNavigate} from 'react-router-dom'


export const AppContext=createContext();

export const AppContextProvider=(props)=>{
  const backEndUrl= import.meta.env.VITE_BACKEND_URL || 'http://localhost:4001';

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData,setUserData]= useState(false);

  const navigate=useNavigate();


  //  fucntion to get authentication status
  const getAuthStatus = async () => {
    try{
      axios.defaults.withCredentials = true; // to allow cookies to be sent with requests
      const {data} = await axios.get(`${backEndUrl}/api/auth/is-auth`);
      if(data.success){
        setIsLoggedIn(true);
        getUserData();
      }else {
        toast.warn("Please login first.");
        navigate('/login');
      }

    }catch(err){
      toast.error(err.message);
    }
  }

  const getUserData = async () =>{
    try{
      axios.defaults.withCredentials=true;
      const {data} = await axios.get(`${backEndUrl}/api/user/data`);

      if(data.success){
        setUserData(data.userData);
        setIsLoggedIn(true);
      }else {
        toast.error(data.message);
      }
    }catch(err){
      toast.error(err.message || "Something went wrong while fetching user data.");
    }
  }

  useEffect(()=>{
    getAuthStatus();
  },[])

  const value={
    backEndUrl,
    isLoggedIn, setIsLoggedIn,
    userData,setUserData,
    getUserData,
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}