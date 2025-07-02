import { Link, useNavigate } from 'react-router-dom';
import { useState,useContext  } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';


import { HiMenu } from "react-icons/hi";


const Navbar = () => {

  const { isLoggedIn,setIsLoggedIn,setUserData, backEndUrl } = useContext(AppContext);
  const navigate = useNavigate();
  // State to manage the mobile menu visibility
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = ()=>{
    setMenuOpen(!menuOpen);
  }
  const handleLoginButton = () => {
    // Navigate to the login page when the button is clicked
    {!isLoggedIn ? navigate('/login') : handleLogout()}
    
  }

  const handleLogout = async () => {
    try{
      axios.defaults.withCredentials=true;
      const {data} = await axios.post(`${backEndUrl}/api/auth/logout`);

      if(data.success){
        setIsLoggedIn(false);
        setUserData(false);
        toast.success(data.message || "User logged out successfully.");
        navigate("/login");
      }
    }catch(err){
      toast.error(err.message || "Something went wrong & logout failed.");
    }
  }
  return (
    <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-30 bg-gradient-to-r from-indigo-700 to-violet-500 transition-all">
        
    <Link to={"/"}>
        <img className="h-9" src={assets.logo} alt="dummyLogoWhite"/>
    </Link>

    <ul className="text-white md:flex hidden items-center gap-10">
        <li><Link className="hover:text-white/70 transition" to={"/"}>Home</Link></li>
        <li><Link className="hover:text-white/70 transition" to={"/login"}>login</Link></li>
        {/* <li><Link className="hover:text-white/70 transition" to={"/email-verify"}>EmailVerify</Link></li> */}
        
        {/* <li><Link className="hover:text-white/70 transition" to={"/reset-password"}>ResetPassword</Link></li> */}
    </ul>

    <button onClick={handleLoginButton} type="button" className="cursor-pointer bg-white text-gray-700 md:inline hidden text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full">
        {isLoggedIn ? "logout" :"login"} 
    </button>

    <button onClick={toggleMenu} aria-label="menu-btn" type="button" className="menu-btn inline-block md:hidden active:scale-90 transition">
        <HiMenu className="text-white text-3xl" />
    </button>

    {menuOpen && <div className="mobile-menu absolute top-[70px] left-0 w-full bg-gradient-to-r from-indigo-700 to-violet-500 p-6 md:hidden z-20">
        <ul className="flex flex-col space-y-4 text-white text-lg">
          <li><Link onClick={toggleMenu} className="hover:text-white/70 transition" to={"/"}>Home</Link></li>
          <li><Link className="hover:text-white/70 transition" to={"/login"}>login</Link></li>

          {/* <li><Link className="hover:text-white/70 transition" to={"/email-verify"}>EmailVerify</Link></li>
          
          <li><Link className="hover:text-white/70 transition" to={"/reset-password"}>ResetPassword</Link></li> */}
        </ul>
        <button onClick={handleLoginButton} type="button" className="bg-white text-gray-700 mt-6 inline md:hidden text-sm hover:opacity-90 active:scale-95 transition-all w-40 h-11 rounded-full">
            {isLoggedIn ? "logout" :"login"}
        </button>
    </div>
    }
</nav>
  )
}

export default Navbar;
