import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User";

@Entity()
export class Materia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ type: "text", nullable: true })
  descripcion?: string;

  @Column({ nullable: true })
  profesorId?: number; // relación sencilla por ahora, luego podemos enlazar con User

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

   // Relaciones
  @ManyToOne(() => User, (user) => user.materiasDictadas, { nullable: true })
  profesor?: User;

  @ManyToMany(() => User, (user) => user.materiasInscritas)
  @JoinTable()
  estudiantes!: User[];
}
