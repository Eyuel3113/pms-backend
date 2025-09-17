import { Router } from "express";
import {
  createUnit, getUnits, getUnitById, updateUnit, deleteUnit, } from "../controllers/unit.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Units
 *   description: Unit management
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
 *     responses:
 *       200:
 *         description: List of units
 */


// Get all units (accessible to SUPER_ADMIN, COMPANY_ADMIN, PROPERTY_MANAGER)
router.get("/", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN", "PROPERTY_MANAGER"]), getUnits);


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
router.get("/:id", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN", "PROPERTY_MANAGER"]), getUnitById);

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
