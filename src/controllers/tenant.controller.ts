import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import prisma from "../config/db";

// ---------------- Create Tenant ----------------
export const createTenant = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { name, email, phone, unitId } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check duplicate email
    const existing = await prisma.tenant.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // If tenant is assigned to a unit, check unit exists
    let unitCheck = null;
    if (unitId) {
      unitCheck = await prisma.unit.findUnique({
        where: { id: unitId },
        include: { property: true },
      });
      if (!unitCheck) return res.status(404).json({ message: "Unit not found" });

      // Restrict by role
      if (req.user.role === "COMPANY_ADMIN" && req.user.companyId !== unitCheck.property.companyId) {
        return res.status(403).json({ message: "Not allowed" });
      }
      if (req.user.role === "PROPERTY_MANAGER" && req.user.id !== unitCheck.property.managerId) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

   const tenant = await prisma.tenant.create({
  data: {
    name,
    email,
    phone,
    tenantOf: {
      connect: { id: unitId }, // 👈 connect relation
    },
  },
});

    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ---------------- Get All Tenants ----------------
export const getTenants = async (req: AuthRequest, res: Response) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: { unit: { include: { property: true } } },
    });
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ---------------- Get Single Tenant ----------------
export const getTenantById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { unit: { include: { property: true } } },
    });

    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ---------------- Update Tenant ----------------
export const updateTenant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, phone, unitId } = req.body;

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { unit: { include: { property: true } } },
    });

    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    // Restrict by role
    if (tenant.unit) {
      if (req.user?.role === "COMPANY_ADMIN" && req.user.companyId !== tenant.unit.property.companyId) {
        return res.status(403).json({ message: "Not allowed" });
      }
      if (req.user?.role === "PROPERTY_MANAGER" && req.user.id !== tenant.unit.property.managerId) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

    const updated = await prisma.tenant.update({
      where: { id },
      data: { name, email, phone, unitId: unitId || null },
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// ---------------- Delete Tenant ----------------
export const deleteTenant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { id },
      include: { leases: true, unit: { include: { property: true } } },
    });

    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    // Prevent deleting tenant with active leases
    if (tenant.leases.length > 0) {
      return res.status(400).json({ message: "Cannot delete tenant with active leases" });
    }

    // Restrict by role
    if (tenant.unit) {
      if (req.user?.role === "COMPANY_ADMIN" && req.user.companyId !== tenant.unit.property.companyId) {
        return res.status(403).json({ message: "Not allowed" });
      }
      if (req.user?.role === "PROPERTY_MANAGER" && req.user.id !== tenant.unit.property.managerId) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

    await prisma.tenant.delete({ where: { id } });
    res.status(200).json({ message: "Tenant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
