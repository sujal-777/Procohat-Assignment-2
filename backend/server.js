import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import bodyParser from 'body-parser';
import imageRoutes from './routes/imageRoutes.js'
import dotenv from 'dotenv';
dotenv.config(); 


const app = express();
app.use(cors())
app.use(bodyParser.json());

//routes
app.use('/api/images', imageRoutes);

const PORT = process.env.PORT ||4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
