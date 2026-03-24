import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();
  
const app = express();

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// JSON
app.use(express.json());

// 🔥 BRANCHEMENT DES ROUTES
app.use("/api", router);

// Route test
app.get("/", (req, res) => res.send("API is running 🚀"));

export default app;