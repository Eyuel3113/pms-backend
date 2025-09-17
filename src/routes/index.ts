import { Router } from "express";
import authRoutes from "./auth.routes";
import companyRoutes from "./company.routes";
import propertyRoutes from "./property.routes";
import tenantRoutes from "./tenant.routes";
import unitRoutes from "./unit.routes";

const router = Router();



// Consolidate all routes here
router.use("/auth", authRoutes);
router.use("/companies", companyRoutes);
router.use("/property", propertyRoutes);
router.use("/unit", unitRoutes);
router.use("/tenants", tenantRoutes);

export default router;
