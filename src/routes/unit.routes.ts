import { Router } from "express";
import {
  createUnit,  updateUnit, deleteUnit,getAllUnits, } from "../controllers/unit.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Units
 *   description: Unit management endpoints
 */

/**
 * @swagger
 * /unit:
 *   post:
 *     summary: Create a new unit
 *     tags: [Units]
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
 *               - floor
 *               - propertyId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Unit A7"
 *               floor:
 *                 type: integer
 *                 example: 1
 *               propertyId:
 *                 type: string
 *                 example: "cmfk3oltt0001unusxu1z02vr"
 *     responses:
 *       201:
 *         description: Unit created successfully
 *       401:
 *         description: Unauthorized
 */
// Create a new unit (COMPANY_ADMIN or PROPERTY_MANAGER only)
router.post("/", authMiddleware(["COMPANY_ADMIN", "PROPERTY_MANAGER"]), createUnit);

/**
 * @swagger
 * /unit:
 *   get:
 *     summary: Get all units
 *     tags: [Units]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter units by name or property name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *           enum: [id, name, createdAt, updatedAt]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           default: desc
 *           enum: [asc, desc]
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of units
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Unit'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */



// Get all units (accessible to SUPER_ADMIN, COMPANY_ADMIN, PROPERTY_MANAGER)
router.get("/", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN", "PROPERTY_MANAGER"]), getAllUnits);


/**
 * @swagger
 * /unit/{id}:
 *   get:
 *     summary: Get unit by ID
 *     tags: [Units]
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
 *         description: Unit details
 *       404:
 *         description: Unit not found
 */

// Get unit by ID
//router.get("/:id", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN", "PROPERTY_MANAGER"]), getUnitById);

/**
 * @swagger
 * /unit/{id}:
 *   put:
 *     summary: Update a unit
 *     tags: [Units]
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
 *                 example: "Updated Unit"
 *               floor:
 *                 type: integer
 *                 example: 2
 *               propertyId:
 *                 type: string
 *                 example: "cmfk3oltt0001unusxu1z02vr"
 *     responses:
 *       200:
 *         description: Unit updated
 *       404:
 *         description: Unit not found
 */



// Update unit
router.put("/:id", authMiddleware(["COMPANY_ADMIN", "PROPERTY_MANAGER"]), updateUnit);

/**
 * @swagger
 * /unit/{id}:
 *   delete:
 *     summary: Delete a unit
 *     tags: [Units]
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
 *         description: Unit deleted
 *       404:
 *         description: Unit not found
 */


// Delete unit
router.delete("/:id", authMiddleware(["COMPANY_ADMIN", "PROPERTY_MANAGER"]), deleteUnit);

export default router;
