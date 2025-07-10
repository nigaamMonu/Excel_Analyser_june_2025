import express from "express";
import { deleteChartByIdAdmin, deleteChartByIdUser, getAllChartForAdmins, getAllChartsUserWise, getChartById, saveChart } from "../controller/chartControllers.js";
import isAuth from "../middleware/userAuth.js";


const chartRouter = express.Router();



// user routes
chartRouter.post('/save',isAuth,saveChart);
chartRouter.get('/user-all',isAuth, getAllChartsUserWise);
chartRouter.get('/get/:id', isAuth,getChartById)
chartRouter.delete('/delete/:id',isAuth,deleteChartByIdUser);


// admin routes
chartRouter.get('/admin-all',isAuth, getAllChartForAdmins);
chartRouter.delete('/admin/delete/:id',isAuth,deleteChartByIdAdmin);

export default chartRouter;