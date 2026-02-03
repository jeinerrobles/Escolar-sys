import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Curso } from "./Curso";
import { User } from "./User";
import { Materia } from "./Materia";

@Entity()
export class Grado {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @OneToMany(() => Curso, curso => curso.grado, { cascade: true })
  cursos!: Curso[];

  @ManyToMany(() => User)
  @JoinTable()
  estudiantes!: User[];

  @ManyToMany(() => Materia, materia => materia.grados)
  materias!: Materia[];

}
