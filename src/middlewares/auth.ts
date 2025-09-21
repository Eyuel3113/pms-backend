import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
export type Role = "SUPER_ADMIN" | "COMPANY_ADMIN" | "PROPERTY_MANAGER" | "TENANT";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";


export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: Role;
    companyId?: string;  // no null
    propertyIds?: string[];
  };
}

export const authMiddleware = (roles: Role[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);

      req.user = {
        id: decoded.id,
        role: decoded.role as Role,
        companyId: decoded.companyId || undefined,
        propertyIds: decoded.propertyIds || [],
      };

      if (roles.length && !roles.includes(req.user.role)) {
        console.log("Forbidden ->", req.user);
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid Token" });
    }
  };
};




// import { verifyToken } from "../utils/token";

// export const authMiddleware = (req, res, next) => {
//   const header = req.headers.authorization;
//   if (!header) return res.status(401).json({ message: "No token" });

//   const token = header.split(" ")[1];
//   try {
//     const decoded = verifyToken(token);
//     req.user = decoded; // { id, role, companyId, propertyIds }
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

