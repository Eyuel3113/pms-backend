import prisma from "../config/db"; 

export async function logActivity({
  userId,
  tenantId,
  propertyId,
  leaseId,
  paymentId,
  companyId,
  action,
  entity,
  entityId,
}: {
  userId?: string;
  tenantId?: string;
  propertyId?: string;
  leaseId?: string;
  paymentId?: string;
  companyId?: string;
  action: string;  // e.g., "CREATED_LEASE", "PAID_RENT"
  entity: string;  // e.g., "Lease", "Payment"
  entityId?: string;
}) {
  return prisma.activityLog.create({
    data: { userId, tenantId, propertyId, leaseId, paymentId, companyId, action, entity, entityId },
  });
}

export async function getEntityLogs(entity: string, entityId: string) {
  return prisma.activityLog.findMany({
    where: { entity, entityId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserLogs(userId: string) {
  return prisma.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
