// import "dotenv/config";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import Departement from "./src/models/Departement.js";
dotenv.config();
import routes from "./src/routes/index.js";


const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
// Routes

app.use("/api", routes);


// Route test
app.get("/", (req, res) => res.send("API is running 🚀"));
app.get("/test", async (req, res) => {
  const dep = await Departement.create({
    name: "volaille",
    label: "volaille"
  });
  res.json(dep);
});

export default app;