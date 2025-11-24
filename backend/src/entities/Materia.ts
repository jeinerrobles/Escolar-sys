import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, JoinTable, ManyToMany } from "typeorm";
import { Grado } from "./Grado";
import { User } from "./User";

@Entity()
export class Materia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @ManyToMany(() => Grado, grado => grado.materias)
  @JoinTable({
    name: "materia_grado",           // nombre de la tabla intermedia
    joinColumn: { name: "materia_id" },
    inverseJoinColumn: { name: "grado_id" }
  })
  grados!: Grado[];

  @ManyToOne(() => User, user => user.materias, { onDelete: 'SET NULL' })
  @JoinColumn({ name: "id_profesor" })
  profesor!: User | null;
}
