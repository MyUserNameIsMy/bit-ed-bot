import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { RoleEnum } from '../../common/enums/role.enum';
import { ClientTutorEntity } from './entities/client-tutor.entity';

@Injectable()
export class GroupService {
  async create() {
    const managers = await UserEntity.find({
      where: { role: RoleEnum.MANAGER },
    });

    const users = await UserEntity.find({
      where: { role: RoleEnum.USER, verified: true },
    });

    const groups = [];

    const usersPerManager = Math.floor(users.length / managers.length);
    let remainingUsers = users.length % managers.length;

    for (let i = 0; i < managers.length; i++) {
      const manager = managers[i];
      const group = { manager, users: [] };

      const numUsers = usersPerManager + (remainingUsers > 0 ? 1 : 0);
      group.users = users.splice(0, numUsers);
      remainingUsers--;

      groups.push(group);
    }

    for (const group of groups) {
      for (const user of group['users']) {
        try {
          const client_tutor = new ClientTutorEntity();
          client_tutor.group_name = group['manager'].firstname || 'magic';
          client_tutor.teacher = group['manager'].telegram_id;
          client_tutor.teacher_nick = group['manager'].telegram_nick;
          client_tutor.student = user.telegram_id;
          client_tutor.student_nick = user.telegram_nick;
          await client_tutor.save();
        } catch (err) {
          console.log(err.message());
        }
      }
    }
    return {
      message: 'Success',
    };
  }
}
