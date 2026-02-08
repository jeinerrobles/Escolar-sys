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
    const user = req.user as any;

    // Obtener el módulo desde query params
    const modulo = req.query.modulo as string; // "boletines" o "notas"

    // 🔹 ADMIN: ve todo (sin cambios)
    if (user.role === 'admin') {
      const grados = await gradoRepository.find({
        relations: [
          "cursos",
          "cursos.estudiantes",
          "cursos.profesor",
          "materias",
          "materias.profesor",
        ],
      });

      const response = grados.map(g => ({
        ...g,
        total_estudiantes: g.cursos.reduce(
            (acc, c) => acc + (c.estudiantes?.length || 0),
            0
        ),
        total_materias: g.materias?.length || 0
      }));

      return res.json(response);
    }

    // 🔹 PROFESOR: lógica diferente según el módulo
    if (user.role === 'profesor') {

      // 📌 MÓDULO DE BOLETINES: Solo grados donde es director de curso
      if (modulo === 'boletines') {
        const grados = await gradoRepository
            .createQueryBuilder("grado")
            .leftJoinAndSelect("grado.cursos", "curso")
            .leftJoinAndSelect("curso.estudiantes", "estudiantes")
            .leftJoinAndSelect("grado.materias", "materia")
            .leftJoinAndSelect("curso.profesor", "cursoProfesor")
            .where("cursoProfesor.id = :userId", { userId: user.id })
            .getMany();

        const response = grados.map(g => ({
          ...g,
          total_estudiantes: g.cursos.reduce(
              (acc, c) => acc + (c.estudiantes?.length || 0),
              0
          ),
          total_materias: g.materias?.length || 0
        }));

        return res.json(response);
      }

          // 📌 MÓDULO DE NOTAS: Todos los grados donde da clase (lógica original)
      // También maneja el caso cuando no se envía el parámetro 'modulo'
      else {
        const grados = await gradoRepository
            .createQueryBuilder("grado")
            .leftJoinAndSelect("grado.cursos", "curso")
            .leftJoinAndSelect("curso.estudiantes", "estudiantes")
            .leftJoinAndSelect("grado.materias", "materia")
            .leftJoinAndSelect("curso.profesor", "cursoProfesor")
            .leftJoinAndSelect("materia.profesor", "materiaProfesor")
            .where(
                "cursoProfesor.id = :userId OR materiaProfesor.id = :userId",
                { userId: user.id }
            )
            .getMany();

        const response = grados.map(g => ({
          ...g,
          total_estudiantes: g.cursos.reduce(
              (acc, c) => acc + (c.estudiantes?.length || 0),
              0
          ),
          total_materias: g.materias?.length || 0
        }));

        return res.json(response);
      }
    }

    // 🔹 ESTUDIANTE: Solo su grado y curso
    if (user.role === 'estudiante') {

      if (modulo === 'boletines') {
        // Buscar el curso donde está matriculado el estudiante
        const grados = await gradoRepository
            .createQueryBuilder("grado")
            .leftJoinAndSelect("grado.cursos", "curso")
            .leftJoinAndSelect("curso.estudiantes", "estudiantes")
            .leftJoinAndSelect("grado.materias", "materia")
            .where("estudiantes.id = :userId", { userId: user.id })
            .getMany();

        // Solo debe haber un grado y curso para el estudiante
        const response = grados.map(g => ({
          ...g,
          total_estudiantes: g.cursos.reduce(
              (acc, c) => acc + (c.estudiantes?.length || 0),
              0
          ),
          total_materias: g.materias?.length || 0,
          // Filtrar cursos para mostrar solo el del estudiante
          cursos: g.cursos.filter(curso =>
              curso.estudiantes.some(est => est.id === user.id)
          )
        }));

        return res.json(response);
      }

      // Para notas u otros módulos
      return res.status(403).json({
        message: "No autorizado para este módulo"
      });
    }

    return res.status(403).json({ message: "No autorizado" });
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;

    const grado = await gradoRepository.findOne({
      where: { id: Number(id) },
      relations: [
        "cursos",
        "cursos.estudiantes",
        "materias"
      ],
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
