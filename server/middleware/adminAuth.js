import userModel from "../models/userModel.js";

const adminAuth=  async( req,res,next)=>{
  const userId = req.userId;

  if(!userId){
    return res.json({
      success:false,
      message:"User not found, not authorized."
    });
  }
  try{
    const user= await userModel.findById(userId);
    if(!user){
      return res.json({
        success:false,
        message:"User not found, not authorized."
      });
    }

    if(user.role !== 'admin'){
      return res.json({
        success:false,
        message:"You are not authorized to access this data."
      });
    }

    next();
  }catch(err){
    return res.json({success:false,message:err.message});
  }

}

export default adminAuth;