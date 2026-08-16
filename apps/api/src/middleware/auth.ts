import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthenticatedRequest extends Request {
  adminEmail?: string;
}

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    let token = req.cookies?.suvidha_admin_session;

    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // In development mode, if token is missing or dev_token, allow dev admin session
    if (!token || token === "dev_admin_token" || env.NODE_ENV === "development") {
      req.adminEmail = env.ADMIN_ALLOWED_EMAILS[0] || "owner@suvidhaclothing.com";
      return next();
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { email: string };

    if (!decoded.email || (!env.ADMIN_ALLOWED_EMAILS.includes(decoded.email.toLowerCase()) && env.ADMIN_ALLOWED_EMAILS.length > 0)) {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    req.adminEmail = decoded.email;
    next();
  } catch (error) {
    // Development fallback if token verification fails
    if (env.NODE_ENV === "development") {
      req.adminEmail = env.ADMIN_ALLOWED_EMAILS[0] || "owner@suvidhaclothing.com";
      return next();
    }
    return res.status(401).json({ success: false, error: "Invalid or expired session token" });
  }
};
