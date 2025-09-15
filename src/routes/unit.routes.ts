import { Router } from "express";
import {
  createUnit, getUnits, getUnitById, updateUnit, deleteUnit, } from "../controllers/unit.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Create a new unit (COMPANY_ADMIN or PROPERTY_MANAGER only)
router.post("/", authMiddleware(["COMPANY_ADMIN", "PROPERTY_MANAGER"]), createUnit);

// Get all units (accessible to SUPER_ADMIN, COMPANY_ADMIN, PROPERTY_MANAGER)
router.get("/", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN", "PROPERTY_MANAGER"]), getUnits);

// Get unit by ID
router.get("/:id", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN", "PROPERTY_MANAGER"]), getUnitById);

// Update unit
router.put("/:id", authMiddleware(["COMPANY_ADMIN", "PROPERTY_MANAGER"]), updateUnit);

// Delete unit
router.delete("/:id", authMiddleware(["COMPANY_ADMIN", "PROPERTY_MANAGER"]), deleteUnit);

export default router;
