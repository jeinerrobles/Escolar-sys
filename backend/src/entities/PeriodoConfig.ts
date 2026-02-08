import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PeriodoConfig {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int' })
    periodo!: number; // 1 - 4

    @Column({ default: false })
    habilitado!: boolean;
}