// src/routes/propertyRoutes.ts
import { Router } from "express";
import { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty, } from "../controllers/property.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Only SUPER_ADMIN or COMPANY_ADMIN can create property
router.post( "/", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN"]), createProperty );

// Get all properties
router.get("/", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN", "PROPERTY_MANAGER"]), getProperties);

// Get single property by ID
router.get("/:id", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN", "PROPERTY_MANAGER"]), getPropertyById);

// Update property
router.put( "/:id", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN"]), updateProperty );

// Delete property
router.delete( "/:id", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN"]), deleteProperty );

export default router;
