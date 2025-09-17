// src/routes/propertyRoutes.ts
import { Router } from "express";
import { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty, } from "../controllers/property.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Property
 *   description: Property management
 */

/**
 * @swagger
 * /property:
 *   post:
 *     summary: Create a new property
 *     tags: [Property]
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
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Eyuel Apartments"
 *               address:
 *                 type: string
 *                 example: "123 Main St, Addis Ababa"
 *     responses:
 *       201:
 *         description: Property created successfully
 *       401:
 *         description: Unauthorized
 */

// Only SUPER_ADMIN or COMPANY_ADMIN can create property
router.post( "/", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN"]), createProperty );




/**
 * @swagger
 * /property:
 *   get:
 *     summary: Get all properties
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of properties
 */




// Get all properties
router.get("/", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN", "PROPERTY_MANAGER"]), getProperties);


/**
 * @swagger
 * /property/{id}:
 *   get:
 *     summary: Get a property by ID
 *     tags: [Property]
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
 *         description: Property details
 *       404:
 *         description: Property not found
 */

// Get single property by ID
router.get("/:id", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN", "PROPERTY_MANAGER"]), getPropertyById);


/**
 * @swagger
 * /property/{id}:
 *   put:
 *     summary: Update a property
 *     tags: [Property]
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
 *                 example: "Updated Property"
 *               address:
 *                 type: string
 *                 example: "456 New Street"
 *     responses:
 *       200:
 *         description: Property updated
 *       404:
 *         description: Property not found
 */

// Update property
router.put( "/:id", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN"]), updateProperty );




/**
 * @swagger
 * /property/{id}:
 *   delete:
 *     summary: Delete a property
 *     tags: [Property]
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
 *         description: Property deleted
 *       404:
 *         description: Property not found
 */

// Delete property
router.delete( "/:id", authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN"]), deleteProperty );

export default router;
