import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes";
import companyRoutes from "./routes/company.routes";
import propertyRoutes from "./routes/property.routes";
import unitRoutes from "./routes/unit.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/unit/", unitRoutes);
// Default route
app.get("/", (req, res) => {
  res.send("Property Management Backend is running");
});

export default app;
