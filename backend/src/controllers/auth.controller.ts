import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { nombre, email, password, role } = req.body;

      const existingUser = await userRepository.findOneBy({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Ya existe una cuenta con este correo" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepository.create({
        nombre,
        email,
        password: hashedPassword,
        role: role || "estudiante",
      });

      await userRepository.save(user);

      return res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
      return res.status(500).json({ message: "Error en el servidor", error });
    }
  }

  static async login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await userRepository.findOneBy({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "1h" }
    );

    // 🔹 Devolvemos también la información del usuario (sin contraseña)
    return res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor", error });
  }
 }
}

