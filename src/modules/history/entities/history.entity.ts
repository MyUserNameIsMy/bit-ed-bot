import { Column, Entity } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';

@Entity('histories')
export class HistoryEntity extends RootAbstractEntity {
  @Column()
  chat_id: string;

  @Column()
  message_id: string;
}
