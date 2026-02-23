import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Materia } from "../entities/Materia";
import { Grado } from "../entities/Grado";
import { User } from "../entities/User";

const materiaRepo = AppDataSource.getRepository(Materia);
const gradoRepo = AppDataSource.getRepository(Grado);
const userRepo = AppDataSource.getRepository(User);

export class MateriaController {

  // ===============================
  // 🔥 Obtener materias según rol
  // ===============================
  static async getAll(req: Request, res: Response) {
    try {
      const user = req.user; // viene del middleware authenticateJWT

      if (!user) {
        return res.status(401).json({ message: "No autorizado" });
      }

      let materias: Materia[] = [];

      // 🔥 ADMIN → ve todas
      if (user.role === "admin") {
        materias = await materiaRepo.find({
          relations: ["grados", "profesor"]
        });
      }

      // 🔥 PROFESOR → solo sus materias
      else if (user.role === "profesor") {
        materias = await materiaRepo.find({
          where: {
            profesor: { id: user.id }
          },
          relations: ["grados", "profesor"]
        });
      }

      // 🔥 ESTUDIANTE → (por ahora vacío o lógica futura)
      else if (user.role === "estudiante") {
        materias = [];
      }

      return res.json(materias);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener materias" });
    }
  }

  // ===============================
  // Obtener materia por ID
  // ===============================
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const materia = await materiaRepo.findOne({
        where: { id: parseInt(id) },
        relations: ["grados", "profesor"]
      });

      if (!materia) {
        return res.status(404).json({ message: "Materia no encontrada" });
      }

      return res.json(materia);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener materia" });
    }
  }

  // ===============================
  // Obtener materias por grado
  // ===============================
  static async getByGrado(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const grado = await gradoRepo.findOne({
        where: { id: parseInt(id) },
        relations: ["materias"]
      });

      if (!grado) {
        return res.status(404).json({ message: "Grado no encontrado" });
      }

      return res.json(grado.materias);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al obtener materias por grado" });
    }
  }

  // ===============================
  // Crear materia (solo admin)
  // ===============================
  static async create(req: Request, res: Response) {
    try {
      const { nombre, id_grados, id_profesor } = req.body;

      const grados = await gradoRepo.findBy({
        id: id_grados
      });

      const profesor = id_profesor
        ? await userRepo.findOneBy({ id: id_profesor })
        : null;

      const materia = materiaRepo.create({
        nombre,
        profesor: profesor || null,
        grados
      });

      await materiaRepo.save(materia);

      return res.status(201).json(materia);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al crear materia" });
    }
  }

  // ===============================
  // Actualizar materia
  // ===============================
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nombre, id_profesor, id_grados } = req.body;

      const materia = await materiaRepo.findOne({
        where: { id: parseInt(id) },
        relations: ["grados", "profesor"]
      });

      if (!materia) {
        return res.status(404).json({ message: "Materia no encontrada" });
      }

      if (nombre) materia.nombre = nombre;

      if (id_profesor !== undefined) {
        materia.profesor = id_profesor
          ? await userRepo.findOneBy({ id: id_profesor })
          : null;
      }

      if (id_grados !== undefined) {
        materia.grados = await gradoRepo.findBy({
          id: id_grados
        });
      }

      await materiaRepo.save(materia);

      return res.json(materia);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al actualizar materia" });
    }
  }

  // ===============================
  // Eliminar materia
  // ===============================
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await materiaRepo.delete(id);

      return res.json({ message: "Materia eliminada correctamente" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error al eliminar materia" });
    }
  }
}
