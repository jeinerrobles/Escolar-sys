import { AppDataSource } from "../data-source";
import { Grado } from "../entities/Grado";

export async function seedGrados() {
  const gradoRepository = AppDataSource.getRepository(Grado);

  const existentes = await gradoRepository.count();
  if (existentes > 0) {
    console.log("⚠️  Los grados ya existen, no se sembrarán nuevamente.");
    return;
  }

  const nombres = [
    "1°", "2°", "3°", "4°", "5°", "6°", 
    "7°", "8°", "9°", "10°", "11°"
  ];

  const grados = nombres.map((nombre) => {
    const g = new Grado();
    g.nombre = nombre;
    return g;
  });

  await gradoRepository.save(grados);
  console.log("✅ Grados sembrados correctamente.");
}
