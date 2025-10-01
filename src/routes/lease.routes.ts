import { Router } from "express";
import {
  createLease,
  getLeases,
  getLeaseById,
  updateLease,
  deleteLease,
} from "../controllers/lease.controller";
import { authMiddleware, Role } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Lease
 *   description: Endpoints for Lease management
 */

/**
 * @swagger
 * /lease:
 *   post:
 *     summary: Create a lease
 *     tags: [Lease]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tenantId, unitId, startDate, endDate, rentAmount]
 *             properties:
 *               tenantId:
 *                 type: string
 *               unitId:
 *                 type: string
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               rentAmount:
 *                 type: number
 *               deposit:
 *                 type: number
 *     responses:
 *       201:
 *         description: Lease created successfully
 */
router.post("/", authMiddleware([ "COMPANY_ADMIN", "PROPERTY_MANAGER", "TENANT"]), createLease);

/**
 * @swagger
 * /lease:
 *   get:
 *     summary: Get all leases with pagination, search, sort
 *     tags: [Lease]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by tenant or unit name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           default: desc
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of leases
 */



router.get("/", authMiddleware([ "COMPANY_ADMIN", "PROPERTY_MANAGER", "TENANT"]), getLeases);


/**
 * @swagger
 * /lease/{id}:
 *   get:
 *     summary: Get a lease by ID
 *     tags: [Lease]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lease ID
 *     responses:
 *       200:
 *         description: Lease details
 */



router.get("/:id", authMiddleware([ "COMPANY_ADMIN", "PROPERTY_MANAGER", "TENANT"]), getLeaseById);

/**
 * @swagger
 * /lease/{id}:
 *   put:
 *     summary: Update a lease
 *     tags: [Lease]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lease ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startDate:
 *                 type: string
 *               endDate:
 *                 type: string
 *               rentAmount:
 *                 type: number
 *               deposit:
 *                 type: number
 *     responses:
 *       200:
 *         description: Lease updated successfully
 */




router.put("/:id", authMiddleware([ "COMPANY_ADMIN", "PROPERTY_MANAGER", "TENANT"]), updateLease);


/**
 * @swagger
 * /lease/{id}:
 *   delete:
 *     summary: Delete a lease
 *     tags: [Lease]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lease ID
 *     responses:
 *       200:
 *         description: Lease deleted successfully
 */



router.delete("/:id", authMiddleware([ "COMPANY_ADMIN", "PROPERTY_MANAGER", "TENANT"]), deleteLease);

export default router;
