import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Materia } from "../entities/Materia";
import { Grado } from "../entities/Grado";
import { User } from "../entities/User";

const materiaRepo = AppDataSource.getRepository(Materia);
const gradoRepo = AppDataSource.getRepository(Grado);
const userRepo = AppDataSource.getRepository(User);

export class MateriaController {

  // Obtener todas las materias
  static async getAll(req: Request, res: Response) {
    const materias = await materiaRepo.find({
      relations: ["grados", "profesor"]
    });
    res.json(materias);
  }

  // Obtener materia por ID
  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const materia = await materiaRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["grados", "profesor"]
    });

    if (!materia)
      return res.status(404).json({ message: "Materia no encontrada" });

    res.json(materia);
  }

  // Obtener materias por grado
  static async getByGrado(req: Request, res: Response) {
    const { id } = req.params;

    const grado = await gradoRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["materias"]
    });

    if (!grado)
      return res.status(404).json({ message: "Grado no encontrado" });

    res.json(grado.materias);
  }

  // Crear materia
  static async create(req: Request, res: Response) {
    const { nombre, id_grados, id_profesor } = req.body;

    const grados = await gradoRepo.findByIds(id_grados || []);

    const profesor = id_profesor
      ? await userRepo.findOneBy({ id: id_profesor })
      : null;

    const materia = materiaRepo.create({
      nombre,
      profesor,
      grados
    });

    await materiaRepo.save(materia);

    res.status(201).json(materia);
  }

  // Actualizar materia
  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nombre, id_profesor, id_grados } = req.body;

    const materia = await materiaRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["grados", "profesor"]
    });

    if (!materia)
      return res.status(404).json({ message: "Materia no encontrada" });

    if (nombre) materia.nombre = nombre;

    if (id_profesor !== undefined) {
      materia.profesor = id_profesor
        ? await userRepo.findOneBy({ id: id_profesor })
        : null;
    }

    if (id_grados !== undefined) {
      materia.grados = await gradoRepo.findByIds(id_grados);
    }

    await materiaRepo.save(materia);
    res.json(materia);
  }

  // Eliminar materia
  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await materiaRepo.delete(id);
    res.json({ message: "Materia eliminada correctamente" });
  }
}
