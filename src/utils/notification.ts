import prisma from "../config/db"; 

export async function createNotification({
  userId,
  tenantId,
  message,
  type,
}: {
  userId?: string;
  tenantId?: string;
  message: string;
  type: string; // e.g., "PAYMENT_DUE", "LEASE_CREATED"
}) {
  return prisma.notification.create({
    data: { userId, tenantId, message, type },
  });
}

export async function markNotificationAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function getUserNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTenantNotifications(tenantId: string) {
  return prisma.notification.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}
