import { Link, useNavigate } from 'react-router-dom';
import { useState,useContext  } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';


import { HiMenu } from "react-icons/hi";
import { FaArrowRight } from "react-icons/fa6";


const Navbar = () => {

  const { isLoggedIn,setIsLoggedIn,setUserData, backEndUrl, userData } = useContext(AppContext);
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


  const sendVerificationEmail = async(e)=>{
    try{
      axios.defaults.withCredentials=true;
      const {data}= await axios.post(`${backEndUrl}/api/auth/send-verify-otp`);


      if(data.success){
        toast.success(data.message || " Otp sent successfully.");
        navigate('/email-verify');
      }else{
        toast.error(data.message);
        navigate('/');
      }
    }catch(err){
      toast.error(err.message);
    }
  }
  return (
    <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-30 bg-gradient-to-r from-indigo-700 to-violet-500 transition-all">
        
    <Link to={"/"}>
        <img className="h-9" src={assets.logo} alt="dummyLogoWhite"/>
    </Link>

    <ul className="text-white md:flex hidden items-center gap-10">
        <li><Link className="hover:text-white/70 transition" to={"/"}>Home</Link></li>
        
        {/* <li><Link className="hover:text-white/70 transition" to={"/reset-password"}>ResetPassword</Link></li>  */}
    </ul>
    {
         userData ? 
        <div className='w-8 h-8 md:flex hidden justify-center items-center rounded-full bg-black text-white relative group'>
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black  pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm rounded-xl'>
              {!userData.isAccountVerified && <li onClick={sendVerificationEmail} className='py-1 px-2 hover:bg-gray-300 rounded-2xl cursor-pointer'>Verify Email</li>}

              <li onClick={()=>navigate('/reset-password')} className='py-1 px-2  rounded-2xl hover:bg-gray-300 cursor-pointer '>Reset Password</li>

              <li onClick={handleLogout} className='py-1 px-2 pr-15 rounded-2xl hover:bg-gray-300 cursor-pointer '>Logout</li>


            </ul>
          </div>
        </div>
        :
        <button onClick={()=>navigate('/login')} className='md:flex hidden items-center  gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 bg-gray-300 hover:bg-gray-100 transition-all cursor-pointer'>
          Login <FaArrowRight/>
        </button>
      }


    <button onClick={toggleMenu} aria-label="menu-btn" type="button" className="menu-btn inline-block md:hidden active:scale-90 transition">
        <HiMenu className="text-white text-3xl" />
    </button>

    {menuOpen && <div className="mobile-menu absolute top-[70px] left-0 w-full bg-gradient-to-r from-indigo-700 to-violet-500 p-6 md:hidden z-20">
        <ul className="flex flex-col space-y-4 text-white text-lg">
          <li><Link onClick={toggleMenu} className="hover:text-white/70 transition" to={"/"}>Home</Link></li>
          <li><Link onClick={()=>{
            toggleMenu();
            handleLoginButton();
          }}className="hover:text-white/70 transition" to={"/login"}>{isLoggedIn?"logout":"login"}</Link></li>

          {isLoggedIn && !userData.isAccountVerified && <li><Link onClick={sendVerificationEmail} className="hover:text-white/70 transition" to={"/email-verify"}>EmailVerify</Link></li>}
          
          {isLoggedIn && <li><Link className="hover:text-white/70 transition" to={"/reset-password"}>ResetPassword</Link></li>}
        </ul>
        
    </div>
    }
</nav>
  )
}

export default Navbar;
