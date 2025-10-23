import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

export class UsuarioController {
  static async getAll(req: Request, res: Response) {
    const usuarios = await userRepository.find();
    res.json(usuarios);
  }

  static async getOne(req: Request, res: Response) {
    const usuario = await userRepository.findOneBy({ id: Number(req.params.id) });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  }

  static async create(req: Request, res: Response) {
    const { nombre, email, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const nuevo = userRepository.create({ nombre, email, password: hashed, role });
    await userRepository.save(nuevo);
    res.status(201).json(nuevo);
  }

  static async update(req: Request, res: Response) {
    const usuario = await userRepository.findOneBy({ id: Number(req.params.id) });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    userRepository.merge(usuario, req.body);
    await userRepository.save(usuario);
    res.json(usuario);
  }

  static async delete(req: Request, res: Response) {
    await userRepository.delete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  }
}
