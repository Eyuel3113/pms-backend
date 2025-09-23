import { Request, Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middlewares/auth";
import { logActivity } from "../utils/activityLog"; 

// ========== CREATE LEASE ==========
export const createLease = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userId, role, companyId } = req.user!;
    const { tenantId, unitId, startDate, endDate, rentAmount, deposit } = req.body;

    if (!tenantId || !unitId || !startDate || !endDate || !rentAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    const unit = await prisma.unit.findUnique({ where: { id: unitId }, include: { property: true } });

    if (!tenant || !unit) return res.status(404).json({ message: "Tenant or Unit not found" });

    // ========== ROLE-BASED ACCESS ==========
    if (role === "TENANT" && tenant.userId !== userId) {
      return res.status(403).json({ message: "Tenant can only create lease for themselves" });
    }

    if (role === "PROPERTY_MANAGER") {
      if (unit.property.managerId !== userId) {
        return res.status(403).json({ message: "Property Manager can only manage leases in their property" });
      }
    }

    if (role === "COMPANY_ADMIN") {
      if (unit.property.companyId !== companyId || tenant.companyId !== companyId) {
        return res.status(403).json({ message: "Company Admin can only manage leases in their company" });
      }
    }

    // ========== CHECK FOR OVERLAPPING LEASE ==========
    const overlapping = await prisma.lease.findFirst({
      where: {
        unitId,
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) },
          },
        ],
      },
    });
    if (overlapping) {
      return res.status(400).json({ message: "This unit already has a lease in the selected period" });
    }

    // ========== CREATE LEASE ==========
    const lease = await prisma.lease.create({
      data: {
        tenantId,
        unitId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rentAmount,
        deposit,
      },
      include: { tenant: true, unit: true },
    });

    
  // Log activity
    await logActivity({
      userId: userId,
      action: "Lease Created",
      entity: "Lease",
      entityId: lease.id,
      companyId: companyId || undefined,
      tenantId:tenantId,
      leaseId:lease.id,
    });
    
    res.status(201).json({ message: "Lease created successfully", lease });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ========== GET ALL LEASES WITH PAGINATION, SEARCH, SORT ==========
export const getLeases = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userId, role, companyId } = req.user!;
    const { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc" } = req.query as any;

    const skip = (Number(page) - 1) * Number(limit);

    // Base filter
    let where: any = {};

    if (role === "TENANT") {
      where.tenant = { userId };
    } else if (role === "PROPERTY_MANAGER") {
      where.unit = { property: { managerId: userId } };
    } else if (role === "COMPANY_ADMIN") {
      where.unit = { property: { companyId } };
    }

    // Search filter (optional)
    if (search) {
      where.OR = [
        { tenant: { name: { contains: search, mode: "insensitive" } } },
        { unit: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [leases, total] = await Promise.all([
      prisma.lease.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        include: { tenant: true, unit: { include: { property: true } } },
      }),
      prisma.lease.count({ where }),
    ]);

    res.status(200).json({
      data: leases,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ========== GET SINGLE LEASE ==========
export const getLeaseById = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userId, role, companyId } = req.user!;
    const { id } = req.params;

    const lease = await prisma.lease.findUnique({
      where: { id },
      include: { tenant: true, unit: { include: { property: true } } },
    });

    if (!lease) return res.status(404).json({ message: "Lease not found" });

    // Role-based access
    if (role === "TENANT" && lease.tenant.userId !== userId) return res.status(403).json({ message: "Forbidden" });
    if (role === "PROPERTY_MANAGER" && lease.unit.property.managerId !== userId) return res.status(403).json({ message: "Forbidden" });
    if (role === "COMPANY_ADMIN" && lease.unit.property.companyId !== companyId) return res.status(403).json({ message: "Forbidden" });

    res.status(200).json({ lease });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ========== UPDATE LEASE ==========
export const updateLease = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userId, role, companyId } = req.user!;
    const { id } = req.params;
    const { startDate, endDate, rentAmount, deposit } = req.body;

    const lease = await prisma.lease.findUnique({
      where: { id },
      include: { tenant: true, unit: { include: { property: true } } },
    });
    if (!lease) return res.status(404).json({ message: "Lease not found" });

    // Role-based access
    if (role === "TENANT" && lease.tenant.userId !== userId) return res.status(403).json({ message: "Forbidden" });
    if (role === "PROPERTY_MANAGER" && lease.unit.property.managerId !== userId) return res.status(403).json({ message: "Forbidden" });
    if (role === "COMPANY_ADMIN" && lease.unit.property.companyId !== companyId) return res.status(403).json({ message: "Forbidden" });

    // Check overlapping for new dates
    if (startDate && endDate) {
      const overlapping = await prisma.lease.findFirst({
        where: {
          unitId: lease.unitId,
          NOT: { id },
          OR: [
            {
              startDate: { lte: new Date(endDate) },
              endDate: { gte: new Date(startDate) },
            },
          ],
        },
      });
      if (overlapping) {
        return res.status(400).json({ message: "This unit already has a lease in the selected period" });
      }
    }

    const updatedLease = await prisma.lease.update({
      where: { id },
      data: { startDate, endDate, rentAmount, deposit },
    });
 // Log activity
    await logActivity({
      userId: userId,
      action: "Lease Updated",
      entity: "Lease",
      entityId: id,
      companyId: companyId || undefined,
      tenantId:lease.tenantId,
      leaseId:id,
    });
    res.status(200).json({ message: "Lease updated successfully", lease: updatedLease });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ========== DELETE LEASE ==========
export const deleteLease = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userId, role, companyId } = req.user!;
    const { id } = req.params;

    const lease = await prisma.lease.findUnique({
      where: { id },
      include: { tenant: true, unit: { include: { property: true } } },
    });
    if (!lease) return res.status(404).json({ message: "Lease not found" });

    // Role-based access
    if (role === "TENANT" && lease.tenant.userId !== userId) return res.status(403).json({ message: "Forbidden" });
    if (role === "PROPERTY_MANAGER" && lease.unit.property.managerId !== userId) return res.status(403).json({ message: "Forbidden" });
    if (role === "COMPANY_ADMIN" && lease.unit.property.companyId !== companyId) return res.status(403).json({ message: "Forbidden" });

    await prisma.lease.delete({ where: { id } });
     // Log activity
    await logActivity({
      userId: userId,
      action: "Lease Deleted",
      entity: "Lease",
      entityId: id,
      companyId: companyId || undefined,
      tenantId:lease.tenantId,
      leaseId:id,
    });
    res.status(200).json({ message: "Lease deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


