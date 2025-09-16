import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { createTenant, getTenants, getTenantById, updateTenant, deleteTenant } from "../controllers/tenant.controller";

const router = Router();

// Only logged-in users can access tenants
router.post("/", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), createTenant);
router.get("/", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), getTenants);
router.get("/:id", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), getTenantById);
router.put("/:id", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), updateTenant);
router.delete("/:id", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), deleteTenant);

export default router;
