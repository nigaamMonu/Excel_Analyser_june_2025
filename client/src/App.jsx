import { ToastContainer } from "react-toastify"
import { Routes, Route } from "react-router-dom";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Upload from "./pages/Upload";



import EmailVerify from "./pages/EmailVerify"
import ResetPassword from "./pages/ResetPassword";
import Analyse from "./pages/Analyse";


const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/email-verify" element={<EmailVerify/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/upload" element={<Upload/>} />
        <Route path="/analyze/:id" element={<Analyse/>} />
      </Routes>
    </div>
  )
}

export default App
