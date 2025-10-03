import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Materia } from "../entities/Materia";
import { User } from "../entities/User";

const materiaRepository = AppDataSource.getRepository(Materia);
const userRepository = AppDataSource.getRepository(User);

export class MateriaController {
  static async getAll(req: Request, res: Response) {
    const materias = await materiaRepository.find();
    return res.json(materias);
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const materia = await materiaRepository.findOne({ where: { id: parseInt(id, 10) } });

    if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
    return res.json(materia);
  }

  static async create(req: Request, res: Response) {
    const { nombre, descripcion, profesorId } = req.body;

    const materia = materiaRepository.create({
      nombre,
      descripcion,
      profesorId,
    });

    await materiaRepository.save(materia);
    return res.status(201).json({ message: "Materia creada", materia });
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { nombre, descripcion, profesorId } = req.body;

    const materia = await materiaRepository.findOne({ where: { id: parseInt(id, 10) } });
    if (!materia) return res.status(404).json({ message: "Materia no encontrada" });

    materia.nombre = nombre ?? materia.nombre;
    materia.descripcion = descripcion ?? materia.descripcion;
    materia.profesorId = profesorId ?? materia.profesorId;

    await materiaRepository.save(materia);
    return res.json({ message: "Materia actualizada", materia });
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const materia = await materiaRepository.findOne({ where: { id: parseInt(id, 10) } });

    if (!materia) return res.status(404).json({ message: "Materia no encontrada" });

    await materiaRepository.remove(materia);
    return res.json({ message: "Materia eliminada" });
  }

  static async asignarProfesor(req: Request, res: Response) {
    const { idMateria, idProfesor } = req.body;

    const materia = await materiaRepository.findOne({ where: { id: idMateria }, relations: ["profesor"] });
    const profesor = await userRepository.findOne({ where: { id: idProfesor, role: "profesor" } });

    if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
    if (!profesor) return res.status(404).json({ message: "Profesor no válido" });

    materia.profesor = profesor;
    await materiaRepository.save(materia);

    return res.json({ message: "Profesor asignado", materia });
  }

  static async inscribirEstudiante(req: Request, res: Response) {
    const { idMateria, idEstudiante } = req.body;

    const materia = await materiaRepository.findOne({ where: { id: idMateria }, relations: ["estudiantes"] });
    const estudiante = await userRepository.findOne({ where: { id: idEstudiante, role: "estudiante" } });

    if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
    if (!estudiante) return res.status(404).json({ message: "Estudiante no válido" });

    materia.estudiantes.push(estudiante);
    await materiaRepository.save(materia);

    return res.json({ message: "Estudiante inscrito", materia });
  }
}
