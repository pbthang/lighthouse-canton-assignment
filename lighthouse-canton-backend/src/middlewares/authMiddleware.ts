import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import type { InferSelectModel } from "drizzle-orm";
import type { userAuthTable } from "../db";

/**
 * Middleware for verifying JWT tokens
 */
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    // req.id = decoded.userId;
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}

/**
 * Get middleware for verifying user roles
 * Use after verifyToken middleware
 */
export function verifyRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Access denied" });
      return;
    }
    if (req.user.role !== role) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: InferSelectModel<typeof userAuthTable>;
    }
  }
}
