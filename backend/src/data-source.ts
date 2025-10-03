import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Materia } from './entities/Materia';
import { Curso } from './entities/Curso'; // ✅ importa Curso

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'jeiner070620',
  database: process.env.DB_NAME || 'escolar_db',
  synchronize: true, // ⚠️ solo en desarrollo
  logging: false,
  entities: [User, Materia, Curso], // ✅ registra Curso aquí
  migrations: [],
  subscribers: [],
});

