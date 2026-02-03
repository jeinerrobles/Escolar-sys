import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './User';
import { Materia } from './Materia';
import { Curso } from './Curso';

@Entity()
@Unique(['estudiante', 'materia', 'curso', 'periodo'])
export class Nota {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  estudiante!: User;

  @ManyToOne(() => Materia, { eager: true })
  materia!: Materia;

  @ManyToOne(() => Curso, { eager: true })
  curso!: Curso;

  @Column({ type: 'int' })
  periodo!: number; // 1 - 4

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  valor!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
