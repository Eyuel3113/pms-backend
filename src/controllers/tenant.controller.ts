import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { logActivity } from "../utils/activityLog";
import { Prisma } from "@prisma/client";
import prisma from "../config/db";

// // ---------------- Create Tenant ----------------
// export const createTenant = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     const { name, email, phone, unitId } = req.body;

//     if (!name || !email || !phone || !unitId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Check duplicate email
//     const existing = await prisma.tenant.findUnique({ where: { email } });
//     if (existing) return res.status(400).json({ message: "Email already exists" });

//     // Check unit exists
//     const unit = await prisma.unit.findUnique({
//       where: { id: unitId },
//       include: { property: true },
//     });
//     if (!unit) return res.status(404).json({ message: "Unit not found" });

//     // Role restrictions
//     if (req.user.role === "COMPANY_ADMIN" && req.user.companyId !== unit.property.companyId) {
//       return res.status(403).json({ message: "Not allowed" });
//     }
//     if (req.user.role === "PROPERTY_MANAGER" && req.user.id !== unit.property.managerId) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     // Create tenant — pass propertyId instead of tenantOf
//     const tenant = await prisma.tenant.create({
//       data: {
//         name,
//         email,
//         phone,
//         unitId: unit.id,
//         propertyId: unit.propertyId, //  connect to property via foreign key
//       },
//     });
 
//     // Tenant registration
// async function registerTenant(userId: string, tenantId: string) {
//   await logActivity({
//     userId:req.user.id,
//     tenantId,
//     action: "TENANT_REGISTERED",
//     entity: "Tenant",
//     entityId: tenantId,
//   });
// }

//     res.status(201).json(tenant);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// };



// // ---------------- Get All Tenants ----------------


// export const getTenants = async (req: AuthRequest, res: Response) => {
//   try {
//     const {
//       page = "1",
//       limit = "10",
//       search = "",
//       sortBy = "createdAt",
//       order = "desc",
//     } = req.query;

//     const pageNum = parseInt(page as string);
//     const limitNum = parseInt(limit as string);

//     // Build search filter (search by name, email, or phone)
//     const where: Prisma.TenantWhereInput = search
//       ? {
//           OR: [
//             { name: { contains: search as string, mode: "insensitive" } },
//             { email: { contains: search as string, mode: "insensitive" } },
//             { phone: { contains: search as string, mode: "insensitive" } },
//           ],
//         }
//       : {};

//     // Validate allowed sortable fields
//     const sortableFields: Record<string, keyof Prisma.TenantOrderByWithRelationInput> =
//       {
//         name: "name",
//         email: "email",
//         phone: "phone",
//         createdAt: "createdAt",
//         updatedAt: "updatedAt",
//       };

//     const sortField = sortableFields[sortBy as string] || "createdAt";

//     // Fetch tenants with pagination, search, and sort
//     const tenants = await prisma.tenant.findMany({
//       where,
//       skip: (pageNum - 1) * limitNum,
//       take: limitNum,
//       orderBy: {
//         [sortField]: order === "desc" ? "desc" : "asc",
//       },
//       include: {
//         unit: {
//           include: {
//             property: true,
//           },
//         },
//       },
//     });

//     const total = await prisma.tenant.count({ where });

//     res.status(200).json({
//       data: tenants,
//       meta: {
//         total,
//         page: pageNum,
//         lastPage: Math.ceil(total / limitNum),
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// };


// // ---------------- Get Single Tenant ----------------
// export const getTenantById = async (req: AuthRequest, res: Response) => {
//   try {
//     const { id } = req.params;
//     const tenant = await prisma.tenant.findUnique({
//       where: { id },
//       include: { unit: { include: { property: true } } },
//     });

//     if (!tenant) return res.status(404).json({ message: "Tenant not found" });
//     res.status(200).json(tenant);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // ---------------- Update Tenant ----------------
// export const updateTenant = async (req: AuthRequest, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { name, email, phone, unitId } = req.body;

//     const tenant = await prisma.tenant.findUnique({
//       where: { id },
//       include: { unit: { include: { property: true } } },
//     });

//     if (!tenant) return res.status(404).json({ message: "Tenant not found" });

//     // Restrict by role
//     if (tenant.unit) {
//       if (req.user?.role === "COMPANY_ADMIN" && req.user.companyId !== tenant.unit.property.companyId) {
//         return res.status(403).json({ message: "Not allowed" });
//       }
//       if (req.user?.role === "PROPERTY_MANAGER" && req.user.id !== tenant.unit.property.managerId) {
//         return res.status(403).json({ message: "Not allowed" });
//       }
//     }

//     const updated = await prisma.tenant.update({
//       where: { id },
//       data: { name, email, phone, unitId: unitId || null },
//     });


// // Tenant info update activity log
// async function updateTenant(userId: string, tenantId: string) {
//   await logActivity({
//     userId:req.user.id,
//     tenantId,
//     action: "TENANT_UPDATED",
//     entity: "Tenant",
//     entityId: tenantId,
//   });
// }


//     res.status(200).json(updated);
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // ---------------- Delete Tenant ----------------
// export const deleteTenant = async (req: AuthRequest, res: Response) => {
//   try {
//     const { id } = req.params;

//     const tenant = await prisma.tenant.findUnique({
//       where: { id },
//       include: { leases: true, unit: { include: { property: true } } },
//     });

//     if (!tenant) return res.status(404).json({ message: "Tenant not found" });

//     // Prevent deleting tenant with active leases
//     if (tenant.leases.length > 0) {
//       return res.status(400).json({ message: "Cannot delete tenant with active leases" });
//     }

//     // Restrict by role
//     if (tenant.unit) {
//       if (req.user?.role === "COMPANY_ADMIN" && req.user.companyId !== tenant.unit.property.companyId) {
//         return res.status(403).json({ message: "Not allowed" });
//       }
//       if (req.user?.role === "PROPERTY_MANAGER" && req.user.id !== tenant.unit.property.managerId) {
//         return res.status(403).json({ message: "Not allowed" });
//       }
//     }

//     await prisma.tenant.delete({ where: { id } });


//         // Log activity
//     await logActivity({
//       userId:req.user.id,
//       tenantId: tenant.id,
//       action: "TENANT_DELETED",
//       entity: "Tenant",
//       entityId: tenant.id,
//       propertyId: tenant.propertyId, 
//     });
//     res.status(200).json({ message: "Tenant deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server Error", error });
//   }
// };


// ===============================
// Create Tenant
// ===============================
export const createTenant = async (req: AuthRequest, res: Response) => {
  try {
    const { userId, unitId, companyId } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // Role-based checks
    if (req.user.role === "COMPANY_ADMIN" && req.user.companyId !== companyId) {
      return res.status(403).json({ message: "You can only create tenants in your company" });
    }
    if (req.user.role === "PROPERTY_MANAGER") {
      // check if property manager manages this unit's property
      const unit = await prisma.unit.findUnique({
        where: { id: unitId },
        include: { property: true },
      });
      if (!unit || unit.property.managerId !== req.user.id) {
        return res.status(403).json({ message: "You can only create tenants in your property" });
      }
    }

    const tenant = await prisma.tenant.create({
      data: { userId, unitId, companyId },
      include: { user: true, unit: true },
    });

    res.status(201).json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// ===============================
// Get Tenants
// ===============================
export const getTenants = async (req: AuthRequest, res: Response) => {
  try {
    const authUser = req.user;

    if (!authUser) return res.status(401).json({ message: "Unauthorized" });

    let tenants;

    if (authUser.role === "SUPER_ADMIN") {
      tenants = await prisma.tenant.findMany({ include: { user: true, unit: true, company: true } });
    } else if (authUser.role === "COMPANY_ADMIN") {
      tenants = await prisma.tenant.findMany({
        where: { companyId: authUser.companyId },
        include: { user: true, unit: true },
      });
    } else if (authUser.role === "PROPERTY_MANAGER") {
      tenants = await prisma.tenant.findMany({
        where: { unit: { property: { managerId: authUser.id } } },
        include: { user: true, unit: true },
      });
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.status(200).json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// ===============================
// Delete Tenant
// ===============================
export const deleteTenant = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const authUser = req.user;

    if (!authUser) return res.status(401).json({ message: "Unauthorized" });

    const tenant = await prisma.tenant.findUnique({ where: { id } });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    if (authUser.role === "SUPER_ADMIN") {
      // allowed
    } else if (authUser.role === "COMPANY_ADMIN") {
      if (tenant.companyId !== authUser.companyId) {
        return res.status(403).json({ message: "You can only delete tenants in your company" });
      }
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    await prisma.tenant.delete({ where: { id } });
    res.status(200).json({ message: "Tenant deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
