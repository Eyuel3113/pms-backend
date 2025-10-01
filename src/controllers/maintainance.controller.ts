import { Request, Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middlewares/auth";

// ================= CREATE REQUEST =================
export const createMaintenanceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { role, id: userId, propertyIds } = req.user!;
    const { title, description, priority, unitId } = req.body;

    // Tenant can only create for their property/unit
    let tenantId = undefined;
    let propertyId = undefined;

    if (role === "TENANT") {
      const tenant = await prisma.tenant.findUnique({ where: { userId } });
      if (!tenant) return res.status(404).json({ message: "Tenant not found" });
      tenantId = tenant.id;
      propertyId = tenant.propertyId!;
    } else {
      // COMPANY_ADMIN / PROPERTY_MANAGER can specify tenant/property
      tenantId = req.body.tenantId;
      propertyId = req.body.propertyId;
    }

    const request = await prisma.maintenanceRequest.create({
      data: {
        title,
        description,
        priority,
        tenantId,
        propertyId,
        unitId,
        createdById: userId,
        assignedToId: req.body.assignedTo || null,
      },
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// ================= GET ALL REQUESTS =================
export const getMaintenanceRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { role, id: userId, propertyIds } = req.user!;
    const { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc" } = req.query as any;
    const skip = (page - 1) * limit;

    let where: any = {};

    if (role === "TENANT") {
      const tenant = await prisma.tenant.findUnique({ where: { userId } });
      if (!tenant) return res.status(404).json({ message: "Tenant not found" });
      where.tenantId = tenant.id;
    } else if (role === "PROPERTY_MANAGER") {
      where.propertyId = { in: propertyIds };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [requests, total] = await Promise.all([
      prisma.maintenanceRequest.findMany({ where, skip, take: Number(limit), orderBy: { [sortBy]: sortOrder } }),
      prisma.maintenanceRequest.count({ where }),
    ]);

    res.status(200).json({
      data: requests,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// ================= GET BY ID =================
export const getMaintenanceRequestById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const request = await prisma.maintenanceRequest.findUnique({ where: { id } });
    if (!request) return res.status(404).json({ message: "Maintenance request not found" });
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// ================= UPDATE =================
export const updateMaintenanceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const request = await prisma.maintenanceRequest.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// ================= DELETE =================
export const deleteMaintenanceRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.maintenanceRequest.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
