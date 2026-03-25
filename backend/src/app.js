import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();
  
const app = express();

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",
  "http://localhost:3000",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS origin not allowed: ${origin}`));
    }
  },
  credentials: true
}));

// JSON
app.use(express.json());

//  BRANCHEMENT DES ROUTES
app.use("/api", router);

// Route test
app.get("/", (req, res) => res.send("API is running 🚀"));

export default app;