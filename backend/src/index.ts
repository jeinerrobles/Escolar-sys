import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import materiaRoutes from './routes/materia.routes';
import cursoRoutes from './routes/curso.routes';
import usuarioRoutes from './routes/usuario.routes';
import gradoRoutes from './routes/grado.routes';
import notasRoutes from './routes/nota.routes';
import { seedGrados } from './seeds/grados.seed';
import boletinRoutes from "./routes/boletin.routes";
import periodosRoutes from "./routes/periodos.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/materias", materiaRoutes);
app.use("/api/cursos", cursoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use('/api/grados', gradoRoutes);
app.use('/api/notas', notasRoutes);
app.use('/api/boletines', boletinRoutes);
app.use('/api/periodos', periodosRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

// iniciar conexión a la BD y luego el server
AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Conectado a MySQL');

    await seedGrados();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar la BD', err);
  });
