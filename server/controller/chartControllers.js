
import mongoose from "mongoose";
import chartModel from "../models/chartModel.js";



// Function to save chart data
// api/chart/save

export const saveChart= async( req,res)=>{
  try{
    const {fileId,chartType,xAxis,yAxis,fileName}=req.body;

    if(!fileId || !chartType || !xAxis || !yAxis || !fileName){
      return res.json({success:false,message:"All fields are required."});
    }

    const newChart= new chartModel({chartType,xAxis,yAxis,fileName,fileId,user:req.userId});

    await newChart.save();

    return res.json({success:true,message:"Chart saved successfully."});
  }catch(err){
    return res.json({success:false,message:err.message});
  }
}

// function to get all charts of a user
// api/chart/user-all
export const getAllChartsUserWise= async(req,res)=>{
  try{
    const charts= await chartModel.find({user:req.userId}).sort({createdAt:-1});
    return res.json({success:true,charts});
  }catch(err){
    return res.json({success:false,message:err.message});
  }
}

// function to get all charts for admins
// api/chart/admin-all
export const getAllChartForAdmins = async(req,res)=>{
  try{
    const charts= await chartModel.find().sort({createdAt:-1});
    return res.json({success:true,charts});
  }catch(err){
    return res.json({success:false,message:err.message});
  }
}

// Function to get a chart by its ID
// api/chart/get/:id
export const getChartById= async(req,res)=>{
  try{
     const chartId=req.params.id;
     const userId=req.userId;
    if(!chartId || !mongoose.Types.ObjectId.isValid(chartId)){
      return res.json({success:false,message:"Invalid chart ID."});
    }

    const chart = await chartModel.findOne({_id:chartId,user:userId});

    if(!chart){
      return res.json({success:false,message:"Chart not found."});
    }

    return res.json({success:true,chart});
  }catch(err){
    return res.json({success:false,message:err.message});
  }
 
}

// function to delete a chart by its ID
// api/chart/delete/:id
export const deleteChartByIdUser= async(req,res)=>{
  try{
    const chartId=req.params.id;
    const userId=req.userId;
    if(!chartId || !mongoose.Types.ObjectId.isValid(chartId)){
      return res.json({success:false,message:"Invalid chart ID."});
    }
    await chartModel.findOneAndDelete({_id:chartId,user:userId});

    return res.json({success:true,message:"Chart deleted successfully."});

  }catch(err){
    return res.json({success:false,message:err.message});
  }
}


// function to delete a chart by its ID for admin
// api/chart/admin/delete/:id
export const deleteChartByIdAdmin = async(req,res)=>{
  try{
    const id= req.params.id;
    await chartModel.findByIdAndDelete({_id:id});
    return res.json({ success: true, message: "Chart deleted by admin." });
  }catch(err){
    return res.json({success:false,message:err.message});
  }
}