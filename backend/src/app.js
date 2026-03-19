
// import "dotenv/config";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import salesRoutes from "./routes/sales.routes.js";
import financeRoutes from "./routes/finance.routes.js";
import healthRoutes from "./routes/health.routes.js";
import animalRoutes from "./routes/animals.routes.js";
import campaignRoutes from "./routes/campaigns.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import buildingRoutes from "./routes/buildings.routes.js";


dotenv.config();
  
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
 
// BRANCHEMENT DES ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/ventes", salesRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/sante", healthRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/buildings", buildingRoutes);

// Route test
app.get("/", (req, res) => res.send("API is running 🚀"));
 
export default app;
 
