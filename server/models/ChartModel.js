import mongoose from "mongoose";


const chartSchema= mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user', required:true,
  },
  fileId:{
    type:mongoose.Schema.Types.ObjectId,ref:'excelRecord',required:true,

  },
  chartType:{
    type:String,required:true,enum:['Bar', 'Line', 'Pie', 'Doughnut','3D Bar', '3D Line'],
  },
  xAxis:{
    type:String,required:true,
  },
  yAxis:{
    type:String,required:true,
  },
  fileName:{
    type:String,required:true,
  }
},{
  timestamps:true
});

const chartModel= mongoose.models.charts || mongoose.model('charts',chartSchema);

export default chartModel;