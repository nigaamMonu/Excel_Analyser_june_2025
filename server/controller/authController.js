// core imorts
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';


/// local imports
import userModel from "../models/userModel.js";
import transporter from '../config/nodemailer.js';


// api/auth/register controller

export const register = async (req, res) => {
  const {name,email, password,role} =req.body;

  if(!name || !email || !password || !role){
    return res.json({success:false, message:"Please fill all the fields."});
  }

  try{
    const existingUser = await userModel.findOne({email});

    if(existingUser){
      return res.json({success:false,message:"User already exists with this email."});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({email, name, password:hashedPassword,role});

    await newUser.save();

    const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET, {expiresIn:'7d'});

    res.cookie('token',token,{
      httpOnly:true,
      secure:process.env.NODE_ENV === 'production',
      sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge:7*24*60*60*1000,
    })


    // sending email
    const mailOptions ={
      from:process.env.SENDER_EMAIL,
      to:email,
      subject:'Welcome to Excel analyser.',
      text : `Hello ${name}, Welcome to Excel analyser website. Your account has been created with email : ${email}. Please verify your email.`
    }
    await transporter.sendMail(mailOptions)

    return res.json({success:true,message:"User registered successfully."});
  }catch(err){
    res.json({success:false,message:err.message});
  }
}

// api/auth/login controller 

export const login =async(req,res)=>{
  const {email,password} = req.body;
  if(!email || !password){
    return res.json({success:false,message:"Please fill all the fields."});
  }

  try{
    const existingUser = await userModel.findOne({email});
    
    if(!existingUser){
      return res.json({success:false,message:"Please register yourself first."});
    }

    const isMatched = await bcrypt.compare(password, existingUser.password);

    if(!isMatched){
      return res.json({success:false,message:"Invalid credentials."});
    }

    const userToken= jwt.sign({id:existingUser._id},process.env.JWT_SECRET, {expiresIn:'7d'});

    res.cookie('token', userToken,{
      httpOnly:true,
      secure:process.env.NODE_ENV === 'production',
      sameSite : process.env.NODE_ENV === 'production' ? 'nond' :'strict',
      maxAge: 7*24*60*60*1000,
    })

    return res.json({success:true, message:"User logged in successfully."});

  }catch(err){
    res.json({success:false,message:err.message});
  }
}

// api/auth/logout controller

export const logout = async (req, res)=>{
  try{
    res.clearCookie('token',{
      httpOnly:true,
      secure : process.env.NODE_ENV === 'production',
      sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    })

    return res.json({success:true,message:"User logged out successfully."});

  }catch(err){
    return res.json({success:false, message:err.message});
  }
}


// check authenticated
export const isAuthenticated=async (req,res)=>{
  try{
    return res.json({success:true});
  }catch(err){
    return res.status(401).json({success:false,message:err.message});
  }
}


// sending vrification otp 
export const sendVeirfyOtp= async (req,res)=>{
  try{
    const {userId}=req;
    const user =await userModel.findById(userId);

    if(user.isAccountVerified){
      return res.json({success:false,message:"account already verified"})
    }

    const otp= String(Math.floor(100000+Math.random()*900000));

    user.verifyOtp=otp;
    user.verifyOtpExpireAt=Date.now()+24*60*60*1000;

    await user.save();

    const emailOptions={
      from:process.env.SENDER_EMAIL,
      to:user.email,
      subject: "Account verification otp.",
      text:`Your OTP is ${otp}. Verify your account with  this otp.`
    }
    await transporter.sendMail(emailOptions);

    return res.json({success:true,message:"verification OTP sent on email."})
  }catch(err){
    return res.json({success:false, message:err.message})
  }
}


// get the otp and verify the otp
export const verifyEmail=async(req,res)=>{
  const { otp} = req.body;
  const {userId} = req;
  if(!userId || ! otp){
    return res.json({success:false, message:"missing details"});
  }

  try{
    const user = await userModel.findById(userId);
    if(!user){
      return res.json({success:false,message:"user not fount"});
    }

    if(user.verifyOtp === "" || user.verifyOtp != otp){
      return res.json({success:false, message:"invalid otp"});
    }

    if(user.verifyOtpExpireAt < Date.now()){
      return res.json({success:false,message:"otp expired"});
    }

    user.isAccountVerified=true;
    user.verifyOtp="";
    user.verifyOtpExpireAt=0;
    await user.save();

    return res.json({success:true, message:"email verified successfully."});
  }catch(err){
    return res.json({success:false,message:err.message});
  }
}

// sending reset password otp
export const sendResetOtp=async (req,res)=>{
  const {email} =req.body;
  if(!email){
    return res.status(401).json({success:false,message:"Email is required for reset otp."});

  }

  try{
    const user= await userModel.findOne({email});


    if(!user){
    
      return res.json({success:false, message:"User not found, register first"});
    }

    const newOtp=String(Math.floor(100000+Math.random()*900000))

    user.resetOtp=newOtp;
    user.resetOtpExpireAt=Date.now()+15*60*1000;

    await user.save();

 
    const mailOptions={
      from :process.env.SENDER_EMAIL,
      to: email,
      subject:" Password Reset OTP",
      text:`Your OTP for reset password is ${newOtp}.`
    }
    await transporter.sendMail(mailOptions);

    return res.json({success:true, message:"OTP for reset send successfully"});

  }catch(err){
    return res.status(401).json({success:false, message:err.message});
  }
}

// Reset user Passwort
export const resetPassword= async(req,res)=>{
  const {email,otp,newPassword}=req.body;

  if(!email || !otp || !newPassword){
    return res.json({success:false, message:"Email, OTP, newPassword are required,"});
  }

  try{
    const user =await userModel.findOne({email});
    if(!user){
      return res.json({success:false, message:"User not found, register first"});
    }

    if(Date.now() > user.resetOtpExpireAt){
      return res.json({success:false, message:"otp has expired, generate again"});
    }
    if(otp===user.resetOtp){
      const hashedPassword=await bcrypt.hash(newPassword,10);
      user.password = hashedPassword;
      user.resetOtp = "";
      user.resetOtpExpireAt = 0;

      user.save();

      return res.json({success:true, message:"password changed successfully."});
    }else{
      return res.json({success:false, message:"Invalid OTP"});
    }


  }catch(err){
    return res.status(401).json({success:false, message:err.message});
  }
}
