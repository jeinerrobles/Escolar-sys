import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  static async getAll(req: Request, res: Response) {
    const users = await userRepository.find({ select: ["id", "nombre", "email", "role", "createdAt"] });
    return res.json(users);
  }

  static async getProfesores(req: Request, res: Response) {
    try {
      const profesores = await userRepository.find({ where: { role: "profesor" } });
      return res.json(profesores);
    } catch (err) {
      res.status(500).json({ message: "Error al obtener profesores" });
    }
  }

  static async getEstudiantes(req: Request, res: Response) {
    try {
      const estudiantes = await userRepository.find({ where: { role: "estudiante" } });
      return res.json(estudiantes);
    } catch (err) {
      res.status(500).json({ message: "Error al obtener estudiantes" });
    }
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const user = await userRepository.findOne({ where: { id: parseInt(id, 10) } });

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json(user);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nombre, email, role, password } = req.body;

    const user = await userRepository.findOne({ where: { id: parseInt(id, 10) } });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    user.nombre = nombre ?? user.nombre;
    user.email = email ?? user.email;
    user.role = role ?? user.role;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await userRepository.save(user);
    return res.json({ message: "Usuario actualizado", user });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const user = await userRepository.findOne({ where: { id: parseInt(id, 10) } });

    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    await userRepository.remove(user);
    return res.json({ message: "Usuario eliminado" });
  }

}
