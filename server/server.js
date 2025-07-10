import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';


import connectDB from './config/mongodb.js';
import authRouter from './Routes/authRouter.js';
import userRouter from './Routes/userRouter.js';
import uploadsRouter from './Routes/uploadsRouter.js';
import chartRouter from './Routes/chartRouter.js';


const app = express();

const PORT =process.env.PORT || 4001;
const allowedOrigins =['http://localhost:5174','http://localhost:5173'];


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:allowedOrigins,
  credentials:true
}));

app.get('/',(req,res)=>{
  res.send("App is working fine.");
})

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/excel',uploadsRouter);
app.use('/api/chart',chartRouter);

app.listen(PORT,()=>{
  connectDB();
  console.log(`Server is running on port http://localhost:${PORT}`);
})