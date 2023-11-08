import { Column, Entity } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';

@Entity('groups')
export class ClientTutorEntity extends RootAbstractEntity {
  @Column({ nullable: true })
  group_name: string;

  @Column()
  teacher: string;

  @Column()
  student: string;

  @Column({ nullable: true })
  teacher_nick: string;

  @Column({ nullable: true })
  student_nick: string;
}
