// src/routes/propertyRoutes.ts
import { Router } from "express";
import { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty, } from "../controllers/property.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Property
 *   description: Property management endpoints
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
 * components:
 *   schemas:
 *     Property:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         managerId:
 *           type: string
 *         companyId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         manager:
 *           $ref: '#/components/schemas/User'
 *         company:
 *           $ref: '#/components/schemas/Company'
 *         units:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Unit'
 *         tenants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Tenant'
 * 
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 * 
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     Unit:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         floor:
 *           type: string
 *         propertyId:
 *           type: string
 * 
 *     Tenant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         unitId:
 *           type: string
 * 
 * /property:
 *   get:
 *     summary: Get all properties
 *     tags: [Property]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
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
 *         description: Search by property name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, updatedAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of properties
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     lastPage:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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
