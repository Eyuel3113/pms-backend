import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import apiRoutes from "./routes"; // import the index router

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Swagger config
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Property Management System API",
      version: "1.0.0",
      description: "API documentation for Property Management System",
    },
    servers: [
      {
        url: "http://localhost:5000/api", // change if needed
      },
    ],
      components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  },
  apis: ["./src/routes/*.ts"], // Path to your route files
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// All routes through /api
app.use("/api", apiRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Property Management Backend is running");
});

export default app;
