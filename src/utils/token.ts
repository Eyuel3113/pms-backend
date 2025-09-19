// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET || "secret";

// export const generateVerificationToken = (userId: string) => {
//   return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
// };

// export const verifyToken = (token: string) => {
//   return jwt.verify(token, JWT_SECRET);
// };


import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface AuthPayload {
  id: string;
  role: string;
  companyId?: string | null;
  propertyIds?: string[];
}

// ====================
// Verification Token
// ====================
export const generateVerificationToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyVerificationToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
};

// ====================
// Auth Token (Login)
// ====================
export const generateAuthToken = (payload: AuthPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
};
