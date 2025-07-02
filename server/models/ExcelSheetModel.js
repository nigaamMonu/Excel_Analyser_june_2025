import mongoose from "mongoose";


const ExcelSheetSchema= new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true,
  },
  fileName:{
    type:String,
    required:true
  },
  data:{type:Array,required:true},
  sizeKB:{type:Number,default:0},
},{
    timestamps:true
});

const excelSheetModel= mongoose.models.excelRecord || mongoose.model('excelRecord',ExcelSheetSchema);

export default excelSheetModel;