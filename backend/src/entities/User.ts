import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from "typeorm";
import { Materia } from "./Materia";
import { Curso } from "./Curso";

export type UserRole = "admin" | "profesor" | "estudiante";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: ["admin", "profesor", "estudiante"], default: "estudiante" })
  role!: UserRole;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ type: "datetime", nullable: true })
  resetTokenExpires?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Materia, (materia) => materia.profesor)
  materiasDictadas!: Materia[];

    // Cursos que dicta (si es profesor)
  @OneToMany(() => Curso, curso => curso.profesor)
  cursosDictados!: Curso[];

  // Cursos inscritos (si es estudiante)
  @ManyToMany(() => Curso, curso => curso.estudiantes)
  cursosTomados!: Curso[];

  @OneToMany(() => Materia, materia => materia.profesor)
  materias!: Materia[];

}

