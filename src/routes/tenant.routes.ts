import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { createTenant, getTenants, getTenantById, updateTenant, deleteTenant } from "../controllers/tenant.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tenants
 *   description: Tenant management endpoints
 */

/**
 * @swagger
 * /tenants:
 *   post:
 *     summary: Create a new tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - unitId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Daniel Tujuma"
 *               email:
 *                 type: string
 *                 example: "dani@gmail.com"
 *               phone:
 *                 type: string
 *                 example: "+251912345678"
 *               unitId:
 *                 type: string
 *                 example: "clm12345abcd6789xyz"
 *     responses:
 *       201:
 *         description: Tenant created successfully
 *       401:
 *         description: Unauthorized
 */

// Only logged-in users can access tenants
router.post("/", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), createTenant);

/**
 * @swagger
 * /tenants:
 *   get:
 *     summary: Get all tenants
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tenants
 */


router.get("/", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), getTenants);

/**
 * @swagger
 * /tenants/{id}:
 *   get:
 *     summary: Get a tenant by ID
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant details
 *       404:
 *         description: Tenant not found
 */

router.get("/:id", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), getTenantById);

/**
 * @swagger
 * /tenants/{id}:
 *   put:
 *     summary: Update a tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Smith"
 *               email:
 *                 type: string
 *                 example: "jane.smith@example.com"
 *               phone:
 *                 type: string
 *                 example: "+251912345679"
 *               unitId:
 *                 type: string
 *                 example: "cmfk3oltt0001unusxu1z02vr"
 *     responses:
 *       200:
 *         description: Tenant updated
 *       404:
 *         description: Tenant not found
 */

router.put("/:id", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), updateTenant);

/**
 * @swagger
 * /tenants/{id}:
 *   delete:
 *     summary: Delete a tenant
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant deleted
 *       404:
 *         description: Tenant not found
 */

router.delete("/:id", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), deleteTenant);

export default router;
