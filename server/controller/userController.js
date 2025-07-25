import userModel from "../models/userModel.js";

// Function to get user data by user ID
// This function retrieves user data based on the provided user ID from the request body.
// It returns the user data if found, or an error message if not found or if an error occurs.
export const getUserData = async (req,res)=>{
    
    try{
      const {userId}= req;

      if(!userId){
        return res.json({success:false,message:"User ID is required"});
      }

      const user= await userModel.findById(userId);
      if(!user){
        return res.json({success:false,message:"User not found"});
      }

      return res.json({
        success:true,
        message:"User data retrieved successfully",
        userData:{
          name:user.name,
          isAccountVerified:user.isAccountVerified,
          email:user.email,
          role:user.role,
        }
      })
    }catch(err){
      return res.json({success:false,message:err.message});
    }
}

// Function to get all users
// This function retrieves all users from the database and returns them in a sorted order.
// api/user/admin/all-users
export const getAllUsers = async (req,res)=>{
  try{
    const users = await userModel.find().sort({createdAt: -1});
    if(!users || users.length === 0){
      return res.json({success:false,message:"No users found."});
    }
    return res.json({success:true,users});
  }catch(err){
    return res.json({success:false,message:err.message});
  }
}