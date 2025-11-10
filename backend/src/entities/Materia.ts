import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Grado } from "./Grado";
import { User } from "./User";

@Entity()
export class Materia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @ManyToOne(() => Grado, grado => grado.materias, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "id_grado" })
  grado!: Grado;

  @ManyToOne(() => User, user => user.materias, { onDelete: 'SET NULL' })
  @JoinColumn({ name: "id_profesor" })
  profesor!: User;
}
