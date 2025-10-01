import { Router } from "express";
import { register, login,verifyEmail,getAuditLogs } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth";


const router = Router();


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Eyuel Endale"
 *               email:
 *                 type: string
 *                 example: "pms@example.com"
 *               password:
 *                 type: string
 *                 example: "strongPassword123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "abi@gmail.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials
 */

router.post("/login", login);



/**
 * @swagger
 * /auth/verify/{token}:
 *   get:
 *     summary: Verify user email
 *     description: Verifies a user's email using the token sent to their email.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: The verification token from the email link
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Email verified successfully"
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: "Invalid or expired verification token"
 *       500:
 *         description: Server error
 */


router.get("/verify-email", verifyEmail);

/**
 * @swagger
 * /auth/audit-log:
 *   get:
 *     summary: Get audit logs with pagination, sorting, and date filters
 *     tags: [ Auth ]
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
 *         description: Number of logs per page
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order by createdAt
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter logs from this date (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter logs until this date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of audit logs with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 50
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "clxyz123abc"
 *                       action:
 *                         type: string
 *                         example: "USER_LOGIN"
 *                       userId:
 *                         type: string
 *                         example: "user123"
 *                       companyId:
 *                         type: string
 *                         example: "company123"
 *                       propertyId:
 *                         type: string
 *                         example: "property123"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-09-19T10:30:00.000Z"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */

router.get("/audit-log",authMiddleware(["SUPER_ADMIN", "COMPANY_ADMIN", "PROPERTY_MANAGER","TENANT"]),getAuditLogs);

export default router;
