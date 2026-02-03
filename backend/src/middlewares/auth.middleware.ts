import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretKey"
    ) as JwtPayload;

    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

export const authorizeRoles = (
  ...roles: Array<"admin" | "profesor" | "estudiante">
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
};
