import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/email.service";
import { generateVerificationToken, verifyVerificationToken ,generateAuthToken} from "../utils/token";
import { AuthRequest } from "../middlewares/auth";
import { logActivity } from "../utils/activityLog";
import prisma from "../config/db";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";



export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password,role,companyId,unitId  } = req.body;


    // Check duplicate email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

       const hashedPassword = await bcrypt.hash(password, 10);


    // Create user
    const user = await prisma.user.create({
      data: { name, email, password:hashedPassword,companyId  ,role, isVerified: false  },
    });

  if (role === "TENANT") {
      await prisma.tenant.create({
        data: {
          userId: user.id,
          companyId: companyId, // must exist
          unitId: unitId , // optional
        },
      });
    }

    // Generate verification token
    const token = generateVerificationToken(user.id);
    const verificationLink = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;

    // Dynamic email content
  
const emailContent = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px; text-align: center;">
    <div style="max-width: 500px; margin: auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <h2 style="color: #333;">🎉 Welcome, ${name}!</h2>
      
      <p style="font-size: 16px; color: #555; line-height: 1.6;">
        Thanks for signing up! Please confirm your email address by clicking the button below.
      </p>
      
      <a href="${verificationLink}" 
         style="display: inline-block; margin-top: 20px; background-color: #4F46E5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
         Verify Email
      </a>
      
      <p style="margin-top: 30px; font-size: 14px; color: #888;">
        If you didn’t create this account, you can safely ignore this email.
      </p>
    </div>
    
    <p style="margin-top: 20px; font-size: 12px; color: #aaa;">
      © ${new Date().getFullYear()} PMS. All rights reserved.
    </p>
  </div>
`;


    await sendEmail({ to: email, subject: "Verify your email", html: emailContent });

    res.status(201).json({ message: "User registered. Check your email for verification." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};


// ======== Login ==========


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

const userWithProperties = await prisma.user.findUnique({
  where: { id: user.id },
  include: { Property: { select: { id: true } } },
});
    const token = generateAuthToken({
  id: user.id,
  role: user.role.trim(),
  companyId: user.companyId,
  propertyIds: userWithProperties?.Property.map((p) => p.id) || [],
});


  // Log activity for login

    await logActivity({
      userId: user.id,
      action: "USER_LOGIN",
      entity: "User",
      entityId: user.id,
      companyId: user.companyId || undefined,
    });


    
    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// =========verify email=========

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: "Token missing" });

    const payload: any = verifyVerificationToken(token as string);

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: { isVerified: true },
    });




    res.json({ message: "Email verified successfully", user });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token", error });
  }
};

// activity log

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const { role, id: userId, companyId, propertyIds } = req.user!;
    const { page = "1", limit = "10", sortBy = "desc", from, to } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    // Date filter
    const dateFilter: any = {};
    if (from || to) {
      dateFilter.createdAt = {};
      if (from) dateFilter.createdAt.gte = new Date(from as string);
      if (to) dateFilter.createdAt.lte = new Date(to as string);
    }

    let whereClause: any = { ...dateFilter };

    if (role === "COMPANY_ADMIN") {
      whereClause.companyId = companyId;
    } else if (role === "PROPERTY_MANAGER") {
      whereClause.propertyId = { in: propertyIds };
    } else if (role !== "SUPER_ADMIN") {
      whereClause.userId = userId;
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where: whereClause,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: sortBy as "asc" | "desc" },
      }),
      prisma.activityLog.count({ where: whereClause }),
    ]);

    res.status(200).json({
      success: true,
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      logs,
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

