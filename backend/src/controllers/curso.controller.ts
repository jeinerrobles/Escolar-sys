import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Curso } from "../entities/Curso";
import { User } from "../entities/User";

const cursoRepository = AppDataSource.getRepository(Curso);
const userRepository = AppDataSource.getRepository(User);

export class CursoController {
  static async getAll(req: Request, res: Response) {
    const cursos = await cursoRepository.find({
      relations: ["profesor", "estudiantes"]
    });
    res.json(cursos);
  }

  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const curso = await AppDataSource.getRepository(Curso).findOne({
        where: { id: parseInt(id) },
        relations: ["profesor", "estudiantes"]
      });

      if (!curso) {
        return res.status(404).json({ message: "Curso no encontrado" });
      }

      res.json(curso);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al obtener curso" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { nombre, descripcion, profesorId, estudiantesIds } = req.body;

      const profesor = await AppDataSource.getRepository(User).findOneBy({ id: profesorId });
      if (!profesor) {
        return res.status(404).json({ message: "Profesor no encontrado" });
      }

      const estudiantes = await AppDataSource.getRepository(User).findByIds(estudiantesIds || []);

      const curso = AppDataSource.getRepository(Curso).create({
        nombre,
        descripcion,
        profesor,
        estudiantes
      });

      await AppDataSource.getRepository(Curso).save(curso);
      res.json(curso);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al crear curso" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, profesorId, estudiantesIds } = req.body;

      const cursoRepo = AppDataSource.getRepository(Curso);
      const userRepo = AppDataSource.getRepository(User);

      const curso = await cursoRepo.findOne({
        where: { id: parseInt(id) },
        relations: ["profesor", "estudiantes"]
      });

      if (!curso) {
        return res.status(404).json({ message: "Curso no encontrado" });
      }

      curso.nombre = nombre ?? curso.nombre;
      curso.descripcion = descripcion ?? curso.descripcion;

      if (profesorId) {
        const profesor = await userRepo.findOneBy({ id: profesorId });
        if (!profesor) {
          return res.status(404).json({ message: "Profesor no encontrado" });
        }
        curso.profesor = profesor;
      }

      if (Array.isArray(estudiantesIds)) {
        const estudiantes = await userRepo.findByIds(estudiantesIds);
        curso.estudiantes = estudiantes;
      }

      await cursoRepo.save(curso);
      res.json(curso);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error al actualizar curso" });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    await cursoRepository.delete(id);
    res.json({ message: "Curso eliminado" });
  }

  static async assignProfesor(req: Request, res: Response) {
    const { id, profesorId } = req.params;
    const curso = await cursoRepository.findOneBy({ id: Number(id) });
    const profesor = await userRepository.findOneBy({ id: Number(profesorId) });

    if (!curso || !profesor) return res.status(404).json({ message: "No encontrado" });

    curso.profesor = profesor;
    await cursoRepository.save(curso);
    res.json({ message: "Profesor asignado" });
  }

  static async assignEstudiantes(req: Request, res: Response) {
    const { id } = req.params;
    const { estudiantesIds } = req.body;

    const curso = await cursoRepository.findOne({
      where: { id: Number(id) },
      relations: ["estudiantes"]
    });

    if (!curso) return res.status(404).json({ message: "Curso no encontrado" });

    const estudiantes = await userRepository.findByIds(estudiantesIds);
    curso.estudiantes = estudiantes;
    await cursoRepository.save(curso);

    res.json({ message: "Estudiantes asignados" });
  }

}
