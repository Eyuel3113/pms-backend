import { createNotification } from "../utils/notification";
import { logActivity } from "../utils/activityLog";
import prisma from "../config/db";

export async function payRent(tenantId: string, leaseId: string, amount: number) {
  // 1. Record payment
  const payment = await prisma.payment.create({
    data: {
      leaseId,
      amount,
      status: "PAID",
      method: "manual",
      paidAt: new Date(),
    },
  });

  // 2. Log activity
  await logActivity({
    tenantId,
    leaseId,
    paymentId: payment.id,
    action: "PAID_RENT",
    entity: "Payment",
    entityId: payment.id,
  });

  // 3. Notify tenant
  await createNotification({
    tenantId,
    message: `Your rent payment of $${amount} has been received.`,
    type: "PAYMENT_RECEIVED",
  });

  return payment;
}
