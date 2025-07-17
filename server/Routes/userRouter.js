import express from 'express';
import { getAllUsers, getUserData } from '../controller/userController.js';
import userAuth from '../middleware/userAuth.js';
import adminAuth from '../middleware/adminAuth.js';


 const userRouter =express.Router();

userRouter.get('/data',userAuth,getUserData);


// admin routes
userRouter.get('/admin/all-users', userAuth, adminAuth, getAllUsers);


export default userRouter;