// import { Response } from "express";
// import { AuthRequest } from "../middlewares/auth";
// import { logActivity } from "../utils/activityLog";
// import prisma from "../config/db";

// // ---------------- Create Unit ----------------
// export const createUnit = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     const { name, floor, propertyId } = req.body;

//     if (!name || floor === undefined || !propertyId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Fetch the property
//     const property = await prisma.property.findUnique({ where: { id: propertyId } });
//     if (!property) return res.status(404).json({ message: "Property not found" });

//     // Role check
//     if (req.user.role === "COMPANY_ADMIN" && req.user.companyId !== property.companyId) {
//       return res.status(403).json({ message: "Forbidden: COMPANY_ADMIN can create unit only for their company" });
//     }
//     if (req.user.role === "PROPERTY_MANAGER" && req.user.id !== property.managerId) {
//       return res.status(403).json({ message: "Forbidden: PROPERTY_MANAGER can create unit only for their managed property" });
//     }

//     // Check unique combination of name + floor + propertyId
//     const duplicateUnit = await prisma.unit.findFirst({
//       where: { name, floor, propertyId },
//     });

//     if (duplicateUnit) {
//       return res.status(400).json({ message: "Unit with this name, floor, and property already exists" });
//     }

//     // Create the unit
//     const unit = await prisma.unit.create({
//       data: {
//         name,
//         floor,
//         property: { connect: { id: propertyId } },
//       },
//     });


// // Unit creation
// async function createUnit(userId: string, unitId: string, propertyId: string) {
//   await logActivity({
//     userId:req.user.id,
//     propertyId,
//     action: "UNIT_CREATED",
//     entity: "Unit",
//     entityId: unitId,
//   });
// }

//     res.status(201).json(unit);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // ---------------- Get All Units ----------------
// export const getUnits = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     const {
//       page = 1,
//       limit = 10,
//       search = "",
//       sortBy = "createdAt",
//       sortOrder = "desc",
//     } = req.query as any;

//     const skip = (Number(page) - 1) * Number(limit);

//     // Base filter depending on role
//     let where: any = {};

//     if (req.user.role === "COMPANY_ADMIN") {
//       where = { property: { companyId: req.user.companyId } };
//     } else if (req.user.role === "PROPERTY_MANAGER") {
//       where = { property: { managerId: req.user.id } };
//     } else if (req.user.role === "TENANT") {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     // Add search filter
//     if (search) {
//       where.OR = [
//         { name: { contains: search, mode: "insensitive" } },
//         { property: { is: { name: { contains: search, mode: "insensitive" } } } },
//       ];
//     }

//     // Fetch data
//     const [units, total] = await Promise.all([
//       prisma.unit.findMany({
//         where,
//         skip,
//         take: Number(limit),
//         orderBy: { [sortBy]: sortOrder },
//         include: { property: true, tenant: true, leases: true },
//       }),
//       prisma.unit.count({ where }),
//     ]);

//     res.status(200).json({
//       data: units,
//       pagination: {
//         total,
//         page: Number(page),
//         limit: Number(limit),
//         totalPages: Math.ceil(total / Number(limit)),
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// };



// // ---------------- Get Single Unit ----------------
// export const getUnitById = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     const { id } = req.params;
//     const unit = await prisma.unit.findUnique({
//       where: { id },
//       include: { property: true, tenant: true, leases: true },
//     });

//     if (!unit) return res.status(404).json({ message: "Unit not found" });

//     // Role-based access for single unit
//     if (
//       (req.user.role === "COMPANY_ADMIN" && req.user.companyId !== unit.property.companyId) ||
//       (req.user.role === "PROPERTY_MANAGER" && req.user.id !== unit.property.managerId) ||
//       req.user.role === "TENANT"
//     ) {
//       return res.status(403).json({ message: "Forbidden" });
//     }

//     res.status(200).json(unit);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// };


// // ---------------- Update Unit ----------------
// export const updateUnit = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     const { id } = req.params;
//     const { name, floor } = req.body;

//     // Fetch the current unit
//     const unit = await prisma.unit.findUnique({
//       where: { id },
//       include: { property: true },
//     });

//     if (!unit) return res.status(404).json({ message: "Unit not found" });

//     // Role check
//     if (req.user.role === "COMPANY_ADMIN" && req.user.companyId !== unit.property.companyId) {
//       return res.status(403).json({ message: "Not allowed" });
//     }
//     if (req.user.role === "PROPERTY_MANAGER" && req.user.id !== unit.property.managerId) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     // Check if another unit exists with the same name, floor, and propertyId
//     const duplicateUnit = await prisma.unit.findFirst({
//       where: {
//         name,
//         floor,
//         propertyId: unit.propertyId,
//         NOT: { id }, // exclude current unit
//       },
//     });

//     if (duplicateUnit) {
//       return res.status(400).json({ message: "Another unit with this name, floor, and property already exists" });
//     }

//     // Update the unit
//     const updated = await prisma.unit.update({
//       where: { id },
//       data: { name, floor },
//     });

//     async function updateUnit(userId: string, propertyId: string) {
//   await logActivity({
//     userId:req.user.id,
//     action: "UNIT_UPDATED",
//     entity: "Unit",
//     entityId: id,
//   });
// }

//     res.status(200).json(updated);
//   } catch (error: any) {
//     if (error.code === "P2002") {
//       return res.status(400).json({ message: "Unit with this name, floor, and property already exists" });
//     }
//     console.error(error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// };

// // ---------------- Delete Unit ----------------
// export const deleteUnit = async (req: AuthRequest, res: Response) => {
//   try {
//     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

//     const { id } = req.params;

//     const unit = await prisma.unit.findUnique({
//       where: { id },
//       include: { property: true, tenant: true, leases: true },
//     });
//     if (!unit) return res.status(404).json({ message: "Unit not found" });

//     // Prevent deletion if active tenants exist
//     if (unit.tenant) return res.status(400).json({ message: "Cannot delete unit with active tenant" });

//     // Role-based access
//     let allowed = false;
//     if (req.user.role === "COMPANY_ADMIN" && req.user.companyId === unit.property.companyId) allowed = true;
//     if (req.user.role === "PROPERTY_MANAGER" && req.user.id === unit.property.managerId) allowed = true;
//     if (!allowed) return res.status(403).json({ message: "Forbidden: Cannot delete this unit" });

//     await prisma.unit.delete({ where: { id } });

//     // Log activity
//     await logActivity({
//       userId:id,
//       propertyId: unit.propertyId,
//       action: "UNIT_DELETED",
//       entity: "Unit",
//       entityId: unit.id,
//     });




//     res.status(200).json({ message: "Unit deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error", error });
//   }
// };



import { Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import { logActivity } from "../utils/activityLog";
import prisma from "../config/db";

// ---------------- Create Unit ----------------
export const createUnit = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { name, floor, propertyId } = req.body;
    if (!name || floor === undefined || !propertyId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Role check
    if (req.user.role === "COMPANY_ADMIN" && req.user.companyId !== property.companyId) {
      return res.status(403).json({ message: "Forbidden: COMPANY_ADMIN can only create unit for their company" });
    }
    if (req.user.role === "PROPERTY_MANAGER" && req.user.id !== property.managerId) {
      console.log({mi:property.managerId});
      console.log({ui:req.user});
       console.log({uii:req.user.id});

      return res.status(403).json({ message: "Forbidden: PROPERTY_MANAGER can only create unit for their managed property" });
    }

    const duplicateUnit = await prisma.unit.findFirst({
      where: { name, floor, propertyId },
    });
    if (duplicateUnit) {
      return res.status(400).json({ message: "Unit with this name, floor, and property already exists" });
    }

    const unit = await prisma.unit.create({
      data: {
        name,
        floor,
        property: { connect: { id: propertyId } },
      },
    });

    //  Log activity
    await logActivity({
      userId: req.user.id,
      propertyId,
      action: "UNIT_CREATED",
      entity: "Unit",
      entityId: unit.id,
    });

    res.status(201).json(unit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// ---------------- Update Unit ----------------
export const updateUnit = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
     console.log("Logged in user:", req.user);

    const { id } = req.params;
    const { name, floor } = req.body;

    const unit = await prisma.unit.findUnique({
      where: { id },
      include: { property: true },
    });
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    if (req.user.role === "COMPANY_ADMIN" && req.user.companyId !== unit.property.companyId) {
      return res.status(403).json({ message: "Not allowed" });
    }
    if (req.user.role === "PROPERTY_MANAGER" && req.user.id !== unit.property.managerId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const duplicateUnit = await prisma.unit.findFirst({
      where: {
        name,
        floor,
        propertyId: unit.propertyId,
        NOT: { id },
      },
    });
    if (duplicateUnit) {
      return res.status(400).json({ message: "Another unit with this name, floor, and property already exists" });
    }

    const updated = await prisma.unit.update({
      where: { id },
      data: { name, floor },
    });

    //  Log activity
    await logActivity({
      userId: req.user.id,
      propertyId: unit.propertyId,
      action: "UNIT_UPDATED",
      entity: "Unit",
      entityId: id,
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

    if (unit.tenant) return res.status(400).json({ message: "Cannot delete unit with active tenant" });

    let allowed = false;
    if (req.user.role === "COMPANY_ADMIN" && req.user.companyId === unit.property.companyId) allowed = true;
    if (req.user.role === "PROPERTY_MANAGER" && req.user.id === unit.property.managerId) allowed = true;
    if (!allowed) return res.status(403).json({ message: "Forbidden: Cannot delete this unit" });

    await prisma.unit.delete({ where: { id } });

    //  Log activity
    await logActivity({
      userId: req.user.id,
      propertyId: unit.propertyId,
      action: "UNIT_DELETED",
      entity: "Unit",
      entityId: unit.id,
    });

    res.status(200).json({ message: "Unit deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error });
  }
};





export const getAllUnits = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // --- Query params ---
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const sortBy = (req.query.sortBy as string) || "createdAt"; // default sort field
    const order = (req.query.order as string) === "asc" ? "asc" : "desc";

    const skip = (page - 1) * limit;

    // --- Role-based filter ---
    let where: any = {
      name: {
        contains: search,
        mode: "insensitive", // case-insensitive search
      },
    };

    switch (req.user.role) {
      case "SUPER_ADMIN":
        // no extra filter
        break;

      case "COMPANY_ADMIN":
        if (!req.user.companyId) {
          return res.status(400).json({ message: "Company ID missing in token" });
        }
        where.property = { companyId: req.user.companyId };
        break;

      case "PROPERTY_MANAGER":
        if (!req.user.propertyIds || req.user.propertyIds.length === 0) {
          return res.status(403).json({ message: "No properties assigned" });
        }
        where.propertyId = { in: req.user.propertyIds };
        break;

      default:
        return res.status(403).json({ message: "Forbidden" });
    }

    // --- Get data + total count ---
    const [units, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        include: { property: true },
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order,
        },
      }),
      prisma.unit.count({ where }),
    ]);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: units,
    });
  } catch (error) {
    console.error("Error fetching units:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

