import { Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middlewares/auth";

// Create Invoice



export const createInvoice = async (req: AuthRequest, res: Response) => {
  try {
    const { role, companyId, id: userId } = req.user!;
    const { leaseId, amount, dueDate } = req.body;
console.log(req.body);
    const lease = await prisma.lease.findUnique({
      where: { id: leaseId },
      include: { unit: { include: { property: true } }, tenant: true },
    });
    if (!lease) return res.status(404).json({ message: "Lease not found" });

    // Role-based access
    if (role === "COMPANY_ADMIN" && lease.unit.property.companyId !== companyId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (role === "PROPERTY_MANAGER") {
      const managerProps = await prisma.property.findMany({ where: { managerId: userId }, select: { id: true } });
      if (!managerProps.map(p => p.id).includes(lease.unit.propertyId)) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    const invoice = await prisma.invoice.create({
      data: {
        leaseId,
        tenantId: lease.tenantId,
        propertyId: lease.unit.propertyId,
        amount,
        dueDate: new Date(dueDate),
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};


// Get All Invoices (with pagination + search + sort)
export const getInvoices = async (req: AuthRequest, res: Response) => {
  try {
    const { role, companyId, id: userId, propertyIds } = req.user!;
    const { page = 1, limit = 10, search = "", sortBy = "createdAt", sortOrder = "desc" } = req.query as any;
    const skip = (page - 1) * limit;

    let where: any = {};

    if (role === "COMPANY_ADMIN") {
      where = { property: { companyId } };
    } else if (role === "PROPERTY_MANAGER") {
      where = { propertyId: { in: propertyIds } };
    } else if (role === "TENANT") {
      where = { tenantId: userId };
    }

    if (search) {
      where.OR = [
        { tenant: { is: { name: { contains: search, mode: "insensitive" } } } },
        { property: { is: { name: { contains: search, mode: "insensitive" } } } },
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({ where, skip, take: Number(limit), orderBy: { [sortBy]: sortOrder } }),
      prisma.invoice.count({ where }),
    ]);

    res.status(200).json({
      data: invoices,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
