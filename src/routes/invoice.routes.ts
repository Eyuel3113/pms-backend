import express from "express";
import { authMiddleware, Role } from "../middlewares/auth";
import { createInvoice, getInvoices } from "../controllers/invoice.controller";
import { createPayment } from "../controllers/payment.controller";

const router = express.Router();

// Invoices
router.post("/", authMiddleware([ "COMPANY_ADMIN", "PROPERTY_MANAGER" ]), createInvoice);
router.get("/", authMiddleware([ "COMPANY_ADMIN", "PROPERTY_MANAGER", "TENANT" ]), getInvoices);

// Payments
router.post("/payment", authMiddleware([ "COMPANY_ADMIN", "PROPERTY_MANAGER", "TENANT" ]), createPayment);

export default router;
