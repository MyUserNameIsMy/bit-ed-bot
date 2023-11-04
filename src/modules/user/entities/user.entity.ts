import { Column, Entity } from 'typeorm';
import { RootAbstractEntity } from '../../../database/entities/root-abstract.entity';
import { RoleEnum } from '../../../common/enums/role.enum';

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

  @Column({ nullable: true })
  telegram_nick: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;
}
