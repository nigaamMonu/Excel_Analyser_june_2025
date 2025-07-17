import xlsx from 'xlsx';
import fs from 'fs';
import mongoose from 'mongoose';
import excelSheetModel from '../models/ExcelSheetModel.js';
import chartModel from '../models/chartModel.js';
import userModel from '../models/userModel.js';

// function to upload a file 
export const uploadExcel = async (req,res)=>{
  try{
    const file=req.file;
    if(!file){
      return res.json({success:false,message: 'No file uploaded, upload again'});
    }

    const workbook= xlsx.readFile(file.path);
    const sheetName= workbook.SheetNames[0];
    const sheetData=xlsx.utils.sheet_to_json(workbook.Sheets[sheetName])

    // save to db
    const excelDoc= new excelSheetModel({
      user:req.userId,
      fileName:file.originalname,
      data:sheetData,
      sizeKB:file.size/1024,
    });

    await excelDoc.save();



    // Delete file after storing data

    fs.unlinkSync(file.path);

    return res.json({success:true,message:"Excel data uploaded successfully."})

  }catch(err){
    return res.json({success:false,message:err.message});
  }
}

// to get all files for user 

export const getAllExcelFilesUserWise = async (req, res) => {
  try {
    const files = await excelSheetModel.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.json({ success: true, files });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// to get all files for admin

export const getAllExcelFilesAdmin = async (req, res) => {
  try{
    const userId=req.userId;
    if(!userId){
      return res.json({success:false,message:"User not found."});
    }
    // Check if user is admin
    const user= await userModel.findById(userId);
    if(!user || user.role !== 'admin'){
      return res.json({success:false,message:"You are not authorized to access this data."});
    }
    const files = await excelSheetModel.find().sort({createdAt: -1});
    if(!files || files.length === 0){
      return res.json({success:false,message:"No files found."});
    }

    return res.json({success:true,files});

  }catch(err){
    return res.json({success:false,message:err.message});
  }
}

// to get a single file by its id

export const getExcelFileById = async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.json({ success: false, message: 'Invalid file ID' });
    }

    const file = await excelSheetModel.findOne({ _id: fileId,  });

    if (!file) return res.json({ success: false, message: "File not found" });

    return res.json({ success: true, file });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// to delete a file by Id

export const deleteExcelFileById = async (req, res) => {
  try {
    const fileId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.json({ success: false, message: 'Invalid file ID' });
    }

    const deleted = await excelSheetModel.findOneAndDelete({ _id: fileId });

    const deleteChartRelatedWithFile= await chartModel.deleteMany({fileId:fileId});

    if (!deleted) return res.json({ success: false, message: "File not found or not authorized" });

    if(!deleteChartRelatedWithFile){
      return res.json({ success: false, message: "Error deleting charts related to this file" });
    }

    return res.json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};