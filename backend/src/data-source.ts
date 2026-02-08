import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Materia } from './entities/Materia';
import { Curso } from './entities/Curso'; 
import { Grado } from './entities/Grado'; 
import { Nota } from './entities/Nota';
import { PeriodoConfig } from './entities/PeriodoConfig';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '270503',
  database: process.env.DB_NAME || 'escolar_db',
  synchronize: true,
  logging: false,
  entities: [User, Materia, Curso, Grado, Nota, PeriodoConfig],
  migrations: [],
  subscribers: [],
});

