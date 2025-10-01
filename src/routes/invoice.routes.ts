import express from "express";
import { authMiddleware, Role } from "../middlewares/auth";
import { createInvoice, getInvoices } from "../controllers/invoice.controller";
import { createPayment } from "../controllers/payment.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Invoices
 *     description: Endpoints for managing Invoices (create, view, update, delete)
 */

// Invoices Create

/**
 * @swagger
 * /invoices:
 *   post:
 *     summary: Create a new invoice
 *     description: COMPANY_ADMIN can create invoices for their company. PROPERTY_MANAGER can create invoices for properties they manage.
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - leaseId
 *               - amount
 *               - dueDate
 *             properties:
 *               leaseId:
 *                 type: string
 *                 example: "cmfxwddrt0001un9wvo07kukr"
 *               amount:
 *                 type: number
 *                 example: 500.0
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-10-10T00:00:00Z"
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Forbidden (not authorized to create invoice for this property/company)
 *       404:
 *         description: Lease not found
 *       500:
 *         description: Server error
 */




router.post("/", authMiddleware([ "COMPANY_ADMIN", "PROPERTY_MANAGER" ]), createInvoice);
//Get invoice

/**
 * @swagger
 * /invoices:
 *   get:
 *     summary: Get all invoices
 *     description: 
 *       - COMPANY_ADMIN → sees all invoices for their company  
 *       - PROPERTY_MANAGER → sees invoices only for properties they manage  
 *       - TENANT → sees only their own invoices  
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         example: "Eyuel Endale"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, dueDate, amount]
 *         example: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         example: desc
 *     responses:
 *       200:
 *         description: List of invoices with pagination
 *       403:
 *         description: Forbidden (not authorized)
 *       500:
 *         description: Server error
 */




router.get("/", authMiddleware([ "COMPANY_ADMIN", "PROPERTY_MANAGER", "TENANT" ]), getInvoices);

// Payments
router.post("/payment", authMiddleware([ "COMPANY_ADMIN", "PROPERTY_MANAGER", "TENANT" ]), createPayment);

export default router;
