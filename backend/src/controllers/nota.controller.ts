import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Nota } from '../entities/Nota';
import { Curso } from '../entities/Curso';
import { Materia } from '../entities/Materia';
import { User } from '../entities/User';

const notaRepo = AppDataSource.getRepository(Nota);
const cursoRepo = AppDataSource.getRepository(Curso);
const materiaRepo = AppDataSource.getRepository(Materia);
const userRepo = AppDataSource.getRepository(User);

export class NotaController {

  // 📌 ESTRUCTURA PARA FRONT
  static async getEstructura(req: Request, res: Response) {
    const { curso, materia, periodo } = req.query;

    const cursoEntity = await cursoRepo.findOne({
      where: { id: Number(curso) },
      relations: ['estudiantes']
    });

    if (!cursoEntity) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    const notas = await notaRepo.find({
      where: {
        curso: { id: Number(curso) },
        materia: { id: Number(materia) },
        periodo: Number(periodo)
      }
    });

    const estudiantes = cursoEntity.estudiantes.map(est => {
      const nota = notas.find(n => n.estudiante.id === est.id);
      return {
        id: est.id,
        nombre: est.nombre,
        nota: nota ? nota.valor : null
      };
    });

    res.json({ estudiantes });
  }

  // 💾 GUARDAR / ACTUALIZAR NOTAS
  static async guardar(req: Request, res: Response) {
    const { curso_id, materia_id, periodo, notas } = req.body;

    const curso = await cursoRepo.findOneBy({ id: curso_id });
    const materia = await materiaRepo.findOneBy({ id: materia_id });

    if (!curso || !materia) {
      return res.status(400).json({ message: 'Curso o materia inválidos' });
    }

    for (const n of notas) {
      const estudiante = await userRepo.findOneBy({ id: n.estudiante_id });
      if (!estudiante) continue;

      let nota = await notaRepo.findOne({
        where: {
          estudiante: { id: estudiante.id },
          curso: { id: curso.id },
          materia: { id: materia.id },
          periodo
        }
      });

      if (nota) {
        nota.valor = n.nota;
      } else {
        nota = notaRepo.create({
          estudiante,
          curso,
          materia,
          periodo,
          valor: n.nota
        });
      }

      await notaRepo.save(nota);
    }

    res.json({ message: 'Notas guardadas correctamente' });
  }
}
