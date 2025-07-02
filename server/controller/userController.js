import userModel from "../models/userModel.js";

// Function to get user data by user ID
// This function retrieves user data based on the provided user ID from the request body.
// It returns the user data if found, or an error message if not found or if an error occurs.
export const getUserData = async (req,res)=>{
    
    try{
      const {userId}= req.body;

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
        }
      })
    }catch(err){
      return res.json({success:false,message:err.message});
    }
}