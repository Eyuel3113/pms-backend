import { Response } from "express";
import prisma from "../config/db";
import { AuthRequest } from "../middlewares/auth";




// Create Payment
export const createPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { role, companyId, id: userId, propertyIds } = req.user!;
    const { invoiceId, amount, method } = req.body;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { property: true, tenant: true },
    });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Authorization
    if (role === "COMPANY_ADMIN" && invoice.property.companyId !== companyId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (role === "PROPERTY_MANAGER" && !propertyIds?.includes(invoice.propertyId)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (role === "TENANT" && invoice.tenantId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Prevent overpayment
    const paidSum = await prisma.payment.aggregate({
      where: { invoiceId },
      _sum: { amount: true },
    });
    if ((paidSum._sum.amount || 0) + amount > invoice.amount) {
      return res.status(400).json({ message: "Payment exceeds invoice amount" });
    }

    const payment = await prisma.payment.create({
      data: { invoiceId, tenantId: invoice.tenantId, propertyId: invoice.propertyId, amount, method },
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
