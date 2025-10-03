import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
    req.user = decoded; // ahora sí compila ✅
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};


export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes((req.user as any).role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
};


