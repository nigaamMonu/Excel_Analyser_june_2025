import express from 'express';
import userAuth from '../middleware/userAuth.js';
import upload from '../middleware/uploadMiddleware.js';
import { deleteExcelFileById, getAllExcelFiles, getExcelFileById, uploadExcel } from '../controller/uploadsController.js';


const uploadsRouter = express.Router();


uploadsRouter.post('/upload',userAuth,upload.single('file'),uploadExcel);
uploadsRouter.get('/all',userAuth,getAllExcelFiles);
uploadsRouter.get('/:id',userAuth,getExcelFileById);
uploadsRouter.delete('/:id',userAuth,deleteExcelFileById);



export default uploadsRouter;