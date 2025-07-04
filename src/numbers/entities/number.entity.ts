import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('lucky_numbers')
export class LuckyNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', unique: true })
  value: number;

  @CreateDateColumn()
  createdAt: Date;
}
