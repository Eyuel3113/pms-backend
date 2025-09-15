import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import prisma from "../config/db";

// ---------------- Create Unit ----------------
export const createUnit = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { name, floor, propertyId } = req.body;

    if (!name || floor === undefined || !propertyId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch the property
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Role check
    if (req.user.role === "COMPANY_ADMIN" && req.user.companyId !== property.companyId) {
      return res.status(403).json({ message: "Forbidden: COMPANY_ADMIN can create unit only for their company" });
    }
    if (req.user.role === "PROPERTY_MANAGER" && req.user.id !== property.managerId) {
      return res.status(403).json({ message: "Forbidden: PROPERTY_MANAGER can create unit only for their managed property" });
    }

    // Check unique combination of name + floor + propertyId
    const duplicateUnit = await prisma.unit.findFirst({
      where: { name, floor, propertyId },
    });

    if (duplicateUnit) {
      return res.status(400).json({ message: "Unit with this name, floor, and property already exists" });
    }

    // Create the unit
    const unit = await prisma.unit.create({
      data: {
        name,
        floor,
        property: { connect: { id: propertyId } },
      },
    });

    res.status(201).json(unit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// ---------------- Get All Units ----------------
export const getUnits = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    let units;
    if (req.user.role === "SUPER_ADMIN") {
      // Super admin sees all units
      units = await prisma.unit.findMany({
        include: { property: true, tenant: true, leases: true },
      });
    } else if (req.user.role === "COMPANY_ADMIN") {
      // Company admin sees units only for their company
      units = await prisma.unit.findMany({
        where: { property: { companyId: req.user.companyId } },
        include: { property: true, tenant: true, leases: true },
      });
    } else if (req.user.role === "PROPERTY_MANAGER") {
      // Property manager sees units only for properties they manage
      units = await prisma.unit.findMany({
        where: { property: { managerId: req.user.id } },
        include: { property: true, tenant: true, leases: true },
      });
    } else {
      // Tenant cannot access units
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(units);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// ---------------- Get Single Unit ----------------
export const getUnitById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const unit = await prisma.unit.findUnique({
      where: { id },
      include: { property: true, tenant: true, leases: true },
    });

    if (!unit) return res.status(404).json({ message: "Unit not found" });

    // Role-based access for single unit
    if (
      (req.user.role === "COMPANY_ADMIN" && req.user.companyId !== unit.property.companyId) ||
      (req.user.role === "PROPERTY_MANAGER" && req.user.id !== unit.property.managerId) ||
      req.user.role === "TENANT"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(unit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};


// ---------------- Update Unit ----------------
export const updateUnit = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const { name, floor } = req.body;

    // Fetch the current unit
    const unit = await prisma.unit.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!unit) return res.status(404).json({ message: "Unit not found" });

    // Role check
    if (req.user.role === "COMPANY_ADMIN" && req.user.companyId !== unit.property.companyId) {
      return res.status(403).json({ message: "Not allowed" });
    }
    if (req.user.role === "PROPERTY_MANAGER" && req.user.id !== unit.property.managerId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Check if another unit exists with the same name, floor, and propertyId
    const duplicateUnit = await prisma.unit.findFirst({
      where: {
        name,
        floor,
        propertyId: unit.propertyId,
        NOT: { id }, // exclude current unit
      },
    });

    if (duplicateUnit) {
      return res.status(400).json({ message: "Another unit with this name, floor, and property already exists" });
    }

    // Update the unit
    const updated = await prisma.unit.update({
      where: { id },
      data: { name, floor },
    });

    res.status(200).json(updated);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Unit with this name, floor, and property already exists" });
    }
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// ---------------- Delete Unit ----------------
export const deleteUnit = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;

    const unit = await prisma.unit.findUnique({
      where: { id },
      include: { property: true, tenant: true, leases: true },
    });
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    // Prevent deletion if active tenants exist
    if (unit.tenant) return res.status(400).json({ message: "Cannot delete unit with active tenant" });

    // Role-based access
    let allowed = false;
    if (req.user.role === "COMPANY_ADMIN" && req.user.companyId === unit.property.companyId) allowed = true;
    if (req.user.role === "PROPERTY_MANAGER" && req.user.id === unit.property.managerId) allowed = true;
    if (!allowed) return res.status(403).json({ message: "Forbidden: Cannot delete this unit" });

    await prisma.unit.delete({ where: { id } });
    res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
