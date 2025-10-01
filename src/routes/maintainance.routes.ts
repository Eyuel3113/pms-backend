import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import {
  createMaintenanceRequest,
  getMaintenanceRequests,
  getMaintenanceRequestById,
  updateMaintenanceRequest,
  deleteMaintenanceRequest,
} from "../controllers/maintainance.controller";

const router = Router();



/**
 * @swagger
 * components:
 *   schemas:
 *     MaintenanceRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         priority:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *         status:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, REJECTED]
 *         tenantId:
 *           type: string
 *         propertyId:
 *           type: string
 *         unitId:
 *           type: string
 *         createdBy:
 *           type: string
 *         assignedTo:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   - name: MaintenanceRequest
 *     description: Endpoints for managing tenant maintenance requests (create, view, update, delete)
 */



/**
 * @swagger
 * /maintaince:
 *   post:
 *     summary: Create maintenance request
 *     tags: [MaintenanceRequest]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               unitId:
 *                 type: string
 *               tenantId:
 *                 type: string
 *               propertyId:
 *                 type: string
 *               assignedTo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created successfully
 */
router.post("/", authMiddleware(["TENANT", "PROPERTY_MANAGER", "COMPANY_ADMIN"]), createMaintenanceRequest);

/**
 * @swagger
 * /maintaince:
 *   get:
 *     summary: Get all maintenance requests
 *     tags: [MaintenanceRequest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of maintenance requests
 */
router.get("/", authMiddleware(["TENANT", "PROPERTY_MANAGER", "COMPANY_ADMIN"]), getMaintenanceRequests);

/**
 * @swagger
 * /maintaince/{id}:
 *   get:
 *     summary: Get a maintenance request by ID
 *     tags: [MaintenanceRequest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance request ID
 *     responses:
 *       200:
 *         description: Maintenance request details
 *       404:
 *         description: Not found
 */



router.get("/:id", authMiddleware(["TENANT", "PROPERTY_MANAGER", "COMPANY_ADMIN"]), getMaintenanceRequestById);

/**
 * @swagger
 * /maintaince/{id}:
 *   put:
 *     summary: Update a maintenance request
 *     tags: [MaintenanceRequest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, REJECTED]
 *               assignedTo:
 *                 type: string
 *               unitId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: Not found
 */



router.put("/:id", authMiddleware(["TENANT", "PROPERTY_MANAGER", "COMPANY_ADMIN"]), updateMaintenanceRequest);

/**
 * @swagger
 * /maintaince/{id}:
 *   delete:
 *     summary: Delete a maintenance request
 *     tags: [MaintenanceRequest]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Maintenance request ID
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */


router.delete("/:id", authMiddleware(["TENANT", "PROPERTY_MANAGER", "COMPANY_ADMIN"]), deleteMaintenanceRequest);

export default router;
