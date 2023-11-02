import { Column, Entity } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';

@Entity('homeworks')
export class HomeworkEntity extends RootAbstractEntity {
  @Column()
  due_to: Date;

  @Column({ type: 'text' })
  text: string;
}
