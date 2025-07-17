import express from "express";
import {
  deleteChartByIdAdmin,
  deleteChartByIdUser,
  getAllChartForAdmins,
  getAllChartsUserWise,
  getChartById,
  saveChart,
} from "../controller/chartControllers.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const chartRouter = express.Router();

// user routes
chartRouter.post("/save", userAuth, saveChart);
chartRouter.get("/user-all", userAuth, getAllChartsUserWise);
chartRouter.get("/get/:id", userAuth, getChartById);
chartRouter.delete("/delete/:id", userAuth, deleteChartByIdUser);

// admin routes
chartRouter.get("/admin-all", userAuth,adminAuth, getAllChartForAdmins);
chartRouter.delete("/admin/delete/:id", userAuth,adminAuth, deleteChartByIdAdmin);

export default chartRouter;
