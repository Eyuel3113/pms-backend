// src/controllers/companyController.ts
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import prisma from "../config/db";
import { Prisma } from "@prisma/client";

/**
 * Create a new company
 * Only SUPER_ADMIN can create
 */
export const createCompany = async (req: AuthRequest, res: Response) => {
  try {
    console.log("User from token:", req.user); // debug

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Forbidden: Only SUPER_ADMIN can create company" });
    }

    const { name } = req.body;

    const existingName=   await prisma.company.findFirst({
      where: { name },
    });

    if(existingName) return res.status(400).json({ message:"Company Name Already Exist Try Another!!"});


    const company = await prisma.company.create({
      data: { name },
    });

    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

/**
 * Get all companies
 */
export const getCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "10", search = "", sortBy = "createdAt", order = "desc" } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    // Build search filter
    const where: Prisma.CompanyWhereInput = search
      ? {
          name: {
            contains: search as string,
            mode: "insensitive",
          },
        }
      : {};

    // Only SUPER_ADMIN sees all, others only their own company
    if (req.user?.role !== "SUPER_ADMIN") {
      Object.assign(where, { id: req.user?.companyId });
    }

    // Validate sort field
    const sortableFields: Record<string, keyof Prisma.CompanyOrderByWithRelationInput> = {
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
};
   const sortField = sortableFields[sortBy as string] || "createdAt";

    const companies = await prisma.company.findMany({
      where,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: {
    [sortField]: order === "desc" ? "desc" : "asc",
  },
    });

    const total = await prisma.company.count({ where });

    res.json({
      data: companies,
      meta: {
        total,
        page: pageNum,
        lastPage: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

/**
 * Get a single company by ID
 */
export const getCompanyById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
    });

    if (!company) return res.status(404).json({ message: "Company not found" });

    if (req.user?.role !== "SUPER_ADMIN" && company.id !== req.user?.companyId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

/**
 * Update a company
 * Only SUPER_ADMIN can update
 */
export const updateCompany = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Forbidden: Only SUPER_ADMIN can update company" });
    }

    const { id } = req.params;
    const { name } = req.body;

    const existingName=await prisma.company.findFirst( { where :{ name }});
    if(existingName) return res.status(400).json( { message:"Company Name Already Exist Try Another!!" } )

    const company = await prisma.company.update({
      where: { id },
      data: { name },
    });

    res.json(company);
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(500).json({ message: "Server Error", error });
  }
};

/**
 * Delete a company
 * Only SUPER_ADMIN can delete
 */
export const deleteCompany = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Forbidden: Only SUPER_ADMIN can delete company" });
    }

    const { id } = req.params;

    await prisma.company.delete({
      where: { id },
    });

    res.json({ message: "Company deleted successfully" });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Company not found" });
    }
    res.status(500).json({ message: "Server Error", error });
  }
};
