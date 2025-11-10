import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";
import { Grado } from "./Grado";

@Entity()
export class Curso {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column({ nullable: true })
  descripcion?: string;

  // Un curso tiene un profesor asignado
  @ManyToOne(() => User, user => user.cursosDictados, { nullable: true })
  profesor?: User;

  // Un curso puede tener muchos estudiantes
  @ManyToMany(() => User, user => user.cursosTomados)
  @JoinTable()
  estudiantes!: User[];

  @ManyToOne(() => Grado, grado => grado.cursos, { nullable: true })
  grado?: Grado;
}
