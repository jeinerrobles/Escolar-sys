import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Grado } from "../entities/Grado";
import { Curso } from "../entities/Curso";
import { User } from "../entities/User";

const gradoRepository = AppDataSource.getRepository(Grado);
const cursoRepository = AppDataSource.getRepository(Curso);
const userRepository = AppDataSource.getRepository(User);

export class GradoController {
  static async getAll(req: Request, res: Response) {
    const grados = await gradoRepository.find({
      relations: ["cursos", "estudiantes"],
    });
    return res.json(grados);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const grado = await gradoRepository.findOne({
      where: { id: Number(id) },
      relations: ["cursos", "estudiantes"],
    });
    if (!grado) return res.status(404).json({ message: "Grado no encontrado" });
    return res.json(grado);
  }

  static async create(req: Request, res: Response) {
    const { nombre } = req.body;
    const grado = gradoRepository.create({ nombre });
    await gradoRepository.save(grado);
    res.status(201).json(grado);
  }

  static async assignCursos(req: Request, res: Response) {
    const { id } = req.params;
    const { cursoIds } = req.body;

    const grado = await gradoRepository.findOne({
      where: { id: Number(id) },
      relations: ["cursos"],
    });

    if (!grado) return res.status(404).json({ message: "Grado no encontrado" });

    const cursos = await cursoRepository.findByIds(cursoIds);
    grado.cursos = cursos;

    await gradoRepository.save(grado);
    res.json(grado);
  }

  static async assignEstudiantes(req: Request, res: Response) {
    const { id } = req.params;
    const { estudianteIds } = req.body;

    const grado = await gradoRepository.findOne({
      where: { id: Number(id) },
      relations: ["estudiantes"],
    });

    if (!grado) return res.status(404).json({ message: "Grado no encontrado" });

    const estudiantes = await userRepository.findByIds(estudianteIds);
    grado.estudiantes = estudiantes;

    await gradoRepository.save(grado);
    res.json(grado);
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nombre } = req.body;
    const grado = await gradoRepository.findOneBy({ id: parseInt(id) });
    if (!grado) return res.status(404).json({ message: "Grado no encontrado" });

    grado.nombre = nombre || grado.nombre;
    await gradoRepository.save(grado);
    res.json(grado);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await gradoRepository.delete(id);
    res.json({ message: "Grado eliminado correctamente" });
  }
}
