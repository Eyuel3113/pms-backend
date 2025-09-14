import { Request, Response, NextFunction } from "express";

// Middleware to check if user has allowed role(s)
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: You don’t have permission" });
    }

    next();
  };
};
