import { Router } from "express";
import { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } from "../controllers/company.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post("/", authMiddleware(["SUPER_ADMIN"]), createCompany); // SUPER_ADMIN only
router.get("/", authMiddleware(["SUPER_ADMIN"]), getCompanies);   // All logged-in users
router.get("/:id", authMiddleware(["SUPER_ADMIN"]), getCompanyById);
router.put("/:id", authMiddleware(["SUPER_ADMIN"]), updateCompany); // SUPER_ADMIN only
router.delete("/:id", authMiddleware(["SUPER_ADMIN"]), deleteCompany); // SUPER_ADMIN only

export default router;
