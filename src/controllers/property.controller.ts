// src/controllers/propertyController.ts
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { Prisma } from "@prisma/client";
import prisma from "../config/db";

/**
 * Create a new Property
 * Only COMPANY_ADMIN or SUPER_ADMIN can create
 */


export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, address, managerId, companyId } = req.body;

    // Role-based companyId assignment
    let assignedCompanyId = companyId;
    if (req.user.role === "COMPANY_ADMIN") {
      assignedCompanyId = req.user.companyId; // COMPANY_ADMIN cannot assign to another company
    }

    // Only SUPER_ADMIN can assign companyId manually
    if (req.user.role === "COMPANY_ADMIN" && companyId && companyId !== req.user.companyId) {
      return res.status(403).json({
        message: "COMPANY_ADMIN can create property only for their company",
      });
    }

    // Check if manager exists
    const manager = await prisma.user.findUnique({
      where: { id: managerId },
    });

    if (!manager) {
      return res.status(404).json({ message: "Property Manager not found" });
    }

    // Ensure manager belongs to same company
    if (manager.companyId !== assignedCompanyId) {
      return res.status(400).json({
        message: "Property Manager must belong to the same company as the property",
      });
    }

    // Create the property
    const property = await prisma.property.create({
      data: {
        name,
        address,
        managerId,
        companyId: assignedCompanyId,
      },
    });

    return res.status(201).json(property);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", error });
  }
};



/**
 * Get all properties
 */
export const getProperties = async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "10", search = "", sortBy = "createdAt", order = "desc" } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    // Build search filter
    const where: Prisma.PropertyWhereInput = search
      ? {
          name: {
            contains: search as string,
            mode: "insensitive", // case-insensitive search
          },
        }
      : {};

    // Restrict for non-super-admin users
    if (req.user?.role !== "SUPER_ADMIN") {
      Object.assign(where, { companyId: req.user?.companyId });
    }

    // Validate sortable fields
    const sortableFields: Record<string, keyof Prisma.PropertyOrderByWithRelationInput> = {
      name: "name",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    };
    const sortField = sortableFields[sortBy as string] || "createdAt";

    // Fetch properties
    const properties = await prisma.property.findMany({
      where,
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
      orderBy: {
        [sortField]: order === "desc" ? "desc" : "asc",
      },
      include: { manager: true, company: true, units: true, tenants: true },
    });

    const total = await prisma.property.count({ where });

    res.json({
      data: properties,
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
 * Get a single property by ID
 */
export const getPropertyById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: { manager: true, company: true, units: true, tenants: true },
    });

    if (!property) return res.status(404).json({ message: "Property not found" });

    if (req.user?.role !== "SUPER_ADMIN" && property.companyId !== req.user?.companyId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

/**
 * Update a property
 * Only SUPER_ADMIN or COMPANY_ADMIN of the same company
 */
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, address, managerId } = req.body;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (
      req.user?.role !== "SUPER_ADMIN" &&
      property.companyId !== req.user?.companyId
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { name, address, managerId },
    });

    res.json(updatedProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

/**
 * Delete a property
 * Only SUPER_ADMIN or COMPANY_ADMIN of the same company
 */
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (
      req.user?.role !== "SUPER_ADMIN" &&
      property.companyId !== req.user?.companyId
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.property.delete({ where: { id } });

    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
