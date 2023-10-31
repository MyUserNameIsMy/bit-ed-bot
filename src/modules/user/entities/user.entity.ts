import { Column, Entity } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';

@Entity('users')
export class UserEntity extends RootAbstractEntity {
  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column()
  telegram_id: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  telegram_nick: string;
}
