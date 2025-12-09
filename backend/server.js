import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";  
import cors from "cors";
import weatherRoutes from "./routes/weatherRoutes.js";

const app=express()
dotenv.config()





// middlewares
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json());

// REGISTER ROUTES
app.use("/api/weather", weatherRoutes);


// Connect to MongoDB
connectDB();



// start server
const port=process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`)
})
