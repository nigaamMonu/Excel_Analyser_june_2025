import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination:function (req,file,cb){
    cb(null, 'uploads');
  },
  filename: function (req,file,cb){
    cb(null, Date.now()+'-',file.originalname);
  },
});

const fileFilter = (req,file,cb) =>{
  const allowedTypes = [ '.xlsx', '.xls'];
  const ext = path.extname(file.originalname);

  if(allowedTypes.includes(ext)){
    cb(null,true);
  }else{
    cb(new Error('Only Excel files are allowed (.xlsx, .xls)'))
  }
}

const upload= multer({storage,fileFilter});

export default upload;