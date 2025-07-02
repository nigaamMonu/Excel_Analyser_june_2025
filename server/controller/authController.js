// core imorts
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';


/// local imports
import userModel from "../models/userModel.js";


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


    // mail sending logic can be added here




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

// export const isAuthenticated = async(req,res)=>{

// }
