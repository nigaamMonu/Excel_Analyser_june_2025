import express from 'express';
import userAuth from '../middleware/userAuth.js';
import upload from '../middleware/uploadMiddleware.js';
import { deleteExcelFileById, getAllExcelFilesUserWise, getExcelFileById, uploadExcel, getAllExcelFilesAdmin } from '../controller/uploadsController.js';
import adminAuth from '../middleware/adminAuth.js';


const uploadsRouter = express.Router();


uploadsRouter.post('/upload',userAuth,upload.single('file'),uploadExcel);
uploadsRouter.get('/all',userAuth,getAllExcelFilesUserWise);
uploadsRouter.get('/:id',userAuth,getExcelFileById);
uploadsRouter.delete('/:id',userAuth,deleteExcelFileById);

// admin routes
uploadsRouter.get('/admin/all', userAuth,adminAuth, getAllExcelFilesAdmin); // Assuming this is for admin as well






export default uploadsRouter;