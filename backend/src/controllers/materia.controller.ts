import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Materia } from "../entities/Materia";
import { Grado } from "../entities/Grado";
import { User } from "../entities/User";

const materiaRepo = AppDataSource.getRepository(Materia);
const gradoRepo = AppDataSource.getRepository(Grado);
const userRepo = AppDataSource.getRepository(User);

export class MateriaController {
  static async getAll(req: Request, res: Response) {
    const materias = await materiaRepo.find({ relations: ["grado", "profesor"] });
    res.json(materias);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const materia = await materiaRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["grado", "profesor"]
    });
    if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
    res.json(materia);
  }

  static async getByGrado(req: Request, res: Response) {
    const { id } = req.params;
    const materias = await materiaRepo.find({
      where: { grado: { id: parseInt(id) } },
      relations: ["grado", "profesor"]
    });
    res.json(materias);
  }

  static async create(req: Request, res: Response) {
    const { nombre, id_grado, id_profesor } = req.body;
    const grado = await gradoRepo.findOneBy({ id: id_grado });
    const profesor = await userRepo.findOneBy({ id: id_profesor });

    const materia = materiaRepo.create({ nombre, grado, profesor } as Partial<Materia>);
    await materiaRepo.save(materia);
    res.status(201).json(materia);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nombre, id_profesor, id_grado } = req.body;

    const materia = await materiaRepo.findOne({
      where: { id: parseInt(id) },
      relations: ["grado", "profesor"]
    });

    if (!materia) return res.status(404).json({ message: "Materia no encontrada" });

    if (nombre) materia.nombre = nombre;
    if (id_profesor) {
      const profesor = await userRepo.findOneBy({ id: id_profesor });
      if (!profesor) return res.status(404).json({ message: "Profesor no encontrado" });
      materia.profesor = profesor;
    }
    if (id_grado) {
      const grado = await gradoRepo.findOneBy({ id: id_grado });
      if (!grado) return res.status(404).json({ message: "Grado no encontrado" });
      materia.grado = grado;
    }

    await materiaRepo.save(materia);
    res.json(materia);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await materiaRepo.delete(id);
    res.json({ message: "Materia eliminada correctamente" });
  }
}
