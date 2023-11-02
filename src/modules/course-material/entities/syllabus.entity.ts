import { Column, Entity } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';

@Entity('syllabus')
export class SyllabusEntity extends RootAbstractEntity {
  @Column()
  date: Date;

  @Column()
  topic: string;

  @Column({ type: 'text' })
  text: string;
}
