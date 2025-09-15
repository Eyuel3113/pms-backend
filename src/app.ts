import express from "express";
import cors from "cors";
import morgan from "morgan";
import apiRoutes from "./routes"; // import the index router

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// All routes through /api
app.use("/api", apiRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Property Management Backend is running");
});

export default app;
