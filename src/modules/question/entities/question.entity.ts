import { Column, Entity } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';

@Entity('questions')
export class QuestionEntity extends RootAbstractEntity {
  @Column({ type: 'text' })
  question_text: string;

  @Column()
  who_asked: string;
}
