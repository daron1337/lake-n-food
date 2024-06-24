import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import * as moment from 'moment-timezone';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  number: number;

  @CreateDateColumn()
  createdAt: Date;
  // Getter to return the createdAt in Rome timezone
  get createdAtRome(): string {
    return moment(this.createdAt).tz('Europe/Rome').format();
  }
}
