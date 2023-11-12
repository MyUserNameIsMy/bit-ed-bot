import { Column, Entity } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';

@Entity('clients_homeworks')
export class ClientHomeworkEntity extends RootAbstractEntity {
  @Column()
  student: string;

  @Column()
  teacher: string;

  @Column()
  homework: string;

  @Column()
  score: string;
}
