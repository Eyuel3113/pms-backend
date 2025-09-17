import { Router } from "express";
import { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } from "../controllers/company.controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company management endpoints
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phoenixopia Ltd"

 *     responses:
 *       201:
 *         description: Company created successfully
 *       401:
 *         description: Unauthorized
 */

router.post("/", authMiddleware(["SUPER_ADMIN"]), createCompany); // SUPER_ADMIN only

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get all companies
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies
 *       401:
 *         description: Unauthorized
 */


router.get("/", authMiddleware(["SUPER_ADMIN"]), getCompanies);   // All logged-in users

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company details
 *       404:
 *         description: Company not found
 */


router.get("/:id", authMiddleware(["SUPER_ADMIN"]), getCompanyById);

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Update a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Phoenixopia Ltd"
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       404:
 *         description: Company not found
 */

router.put("/:id", authMiddleware(["SUPER_ADMIN"]), updateCompany); // SUPER_ADMIN only


/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 */

router.delete("/:id", authMiddleware(["SUPER_ADMIN"]), deleteCompany); // SUPER_ADMIN only

export default router;
