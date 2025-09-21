import { Request, Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middlewares/auth";

// ================= CREATE LEASE =================
export const createLease = async (req: AuthRequest, res: Response) => {
  try {
    const { role, companyId, id: userId } = req.user!;
    const { tenantId, unitId, startDate, endDate, rentAmount, deposit } = req.body;

    // --- Fetch tenant & unit to validate scope ---
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId },});
    const unit = await prisma.unit.findUnique({ where: { id: unitId }, include: { property: true } });

    if (!tenant || !unit) {
      return res.status(404).json({ success: false, message: "Tenant or Unit not found" });
    }

    // --- Authorization Logic ---
    if (role === "COMPANY_ADMIN") {
      //  Company Admin  must match company
      if (tenant.companyId !== companyId || unit.property.companyId !== companyId) {
        return res.status(403).json({ success: false, message: "Not authorized to create lease for this tenant/unit" });
      }
    } else if (role === "PROPERTY_MANAGER") {
      //  Property Manager  must manage that property
      const managerProperties = await prisma.property.findMany({
        where: { managerId: userId },
        select: { id: true },
      });
      const managedPropertyIds = managerProperties.map(p => p.id);

      if (!managedPropertyIds.includes(unit.propertyId)) {
        return res.status(403).json({ success: false, message: "Not authorized to create lease for this property" });
      }
    } else if (role === "TENANT") {
      //  Tenant can only create for themselves
      if (tenant.userId !== userId) {
        return res.status(403).json({ success: false, message: "Tenants can only create leases for themselves" });
      }
    } else {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // --- Create Lease ---
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

    res.status(201).json({ success: true, lease });
  } catch (error) {
    console.error("Error creating lease:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
