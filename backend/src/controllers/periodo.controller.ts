import { AppDataSource } from "../data-source";
import { PeriodoConfig } from "../entities/PeriodoConfig";
import { Request, Response } from "express";

export class PeriodoController {

  static async getPeriodos(req: Request, res: Response) {
    const periodos = await AppDataSource
      .getRepository(PeriodoConfig)
      .find({ order: { periodo: 'ASC' } });

    res.json({ periodos });
  }

  static async actualizarPeriodos(req: Request, res: Response) {
  try {
    const { periodos } = req.body;

    if (!Array.isArray(periodos)) {
      return res.status(400).json({ message: 'Formato inválido' });
    }

    const repo = AppDataSource.getRepository(PeriodoConfig);

    for (const p of periodos) {
      const id = Number(p.id);

      if (isNaN(id)) continue;

      await repo.update(
        { id },
        { habilitado: !!p.habilitado }
      );
    }

    res.json({ message: 'Periodos actualizados correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar periodos' });
  }
}



}
