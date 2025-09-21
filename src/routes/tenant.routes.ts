import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { createTenant, getTenants, deleteTenant } from "../controllers/tenant.controller";

const router = Router();

// /**
//  * @swagger
//  * tags:
//  *   name: Tenants
//  *   description: Tenant management endpoints
//  */

// /**
//  * @swagger
//  * /tenants:
//  *   post:
//  *     summary: Create a new tenant
//  *     tags: [Tenants]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *               - email
//  *               - phone
//  *               - unitId
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "Daniel Tujuma"
//  *               email:
//  *                 type: string
//  *                 example: "dani@gmail.com"
//  *               phone:
//  *                 type: string
//  *                 example: "+251912345678"
//  *               unitId:
//  *                 type: string
//  *                 example: "clm12345abcd6789xyz"
//  *     responses:
//  *       201:
//  *         description: Tenant created successfully
//  *       401:
//  *         description: Unauthorized
//  */

// // Only logged-in users can access tenants
// router.post("/", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), createTenant);

// /**
//  * @swagger
//  * /tenants:
//  *   get:
//  *     summary: Get all tenants
//  *     tags: [Tenants]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *         description: Page number for pagination
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           default: 10
//  *         description: Number of tenants per page
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *         description: Search by name, email, or phone
//  *       - in: query
//  *         name: sortBy
//  *         schema:
//  *           type: string
//  *           enum: [name, email, phone, createdAt, updatedAt]
//  *           default: createdAt
//  *         description: Field to sort by
//  *       - in: query
//  *         name: order
//  *         schema:
//  *           type: string
//  *           enum: [asc, desc]
//  *           default: desc
//  *         description: Sort order
//  *     responses:
//  *       200:
//  *         description: List of tenants with pagination
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 data:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/Tenant'
//  *                 meta:
//  *                   type: object
//  *                   properties:
//  *                     total:
//  *                       type: integer
//  *                       example: 100
//  *                     page:
//  *                       type: integer
//  *                       example: 1
//  *                     lastPage:
//  *                       type: integer
//  *                       example: 10
//  *       401:
//  *         description: Unauthorized
//  */


// router.get("/", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), getTenants);

// /**
//  * @swagger
//  * /tenants/{id}:
//  *   get:
//  *     summary: Get a tenant by ID
//  *     tags: [Tenants]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Tenant details
//  *       404:
//  *         description: Tenant not found
//  */

// router.get("/:id", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), getTenantById);

// /**
//  * @swagger
//  * /tenants/{id}:
//  *   put:
//  *     summary: Update a tenant
//  *     tags: [Tenants]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "Jane Smith"
//  *               email:
//  *                 type: string
//  *                 example: "jane.smith@example.com"
//  *               phone:
//  *                 type: string
//  *                 example: "+251912345679"
//  *               unitId:
//  *                 type: string
//  *                 example: "cmfk3oltt0001unusxu1z02vr"
//  *     responses:
//  *       200:
//  *         description: Tenant updated
//  *       404:
//  *         description: Tenant not found
//  */

// router.put("/:id", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), updateTenant);

// /**
//  * @swagger
//  * /tenants/{id}:
//  *   delete:
//  *     summary: Delete a tenant
//  *     tags: [Tenants]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Tenant deleted
//  *       404:
//  *         description: Tenant not found
//  */

// router.delete("/:id", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), deleteTenant);

// export default router;



/**
 * @swagger
 * tags:
 *   name: Tenant
 *   description: Tenant management
 */

/**
 * @swagger
 * /tenants:
 *   get:
 *     summary: Get all tenants
 *     tags: [Tenant]
 *     responses:
 *       200:
 *         description: List of tenants
 */
router.get("/", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), getTenants);
/**
 * @swagger
 * /tenants:
 *   post:
 *     summary: Create a new tenant
 *     tags: [Tenant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, companyId]
 *             properties:
 *               userId:
 *                 type: string
 *               unitId:
 *                 type: string
 *               companyId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tenant created successfully
 */
// Only logged-in users can access tenants
router.post("/", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), createTenant);
/**
 * @swagger
 * /tenants/{id}:
 *   delete:
 *     summary: Delete a tenant
 *     tags: [Tenant]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant deleted successfully
 */
router.delete("/:id", authMiddleware(["SUPER_ADMIN","COMPANY_ADMIN","PROPERTY_MANAGER"]), deleteTenant);

export default router;