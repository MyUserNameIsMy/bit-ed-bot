import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { RoleEnum } from '../../common/enums/role.enum';
import { ClientTutorEntity } from './entities/client-tutor.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { ShareDto } from './dto/share.dto';

@Injectable()
export class GroupService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}
  async share(shareDto: ShareDto) {
    const group_members = await ClientTutorEntity.find({
      where: {
        group_name: shareDto.group_name,
      },
    });
    console.log(shareDto);
    for (const member of group_members) {
      try {
        await this.bot.telegram.sendMessage(
          member.student,
          `Пройдите пожалуйста на зум сессию по ссылки ${shareDto.link}`,
        );
        console.log(
          member.student + ' ' + `${shareDto.link}` + ' ' + shareDto.group_name,
        );
      } catch (err) {
        const admin = await UserEntity.findOneOrFail({
          where: {
            role: RoleEnum.ADMIN,
            telegram_nick: 'Skelet4on',
          },
        });
        await this.bot.telegram.sendMessage(admin?.telegram_id, err.message);
      }
    }
  }
  async createGroups() {
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
      const group = { manager: manager, users: [] };

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
          console.log(err.message);
        }
      }
    }
    return {
      message: 'Success',
    };
  }

  async createGroup(groupDto: CreateGroupDto) {
    try {
      const old_group = await ClientTutorEntity.find({
        where: { student: groupDto.student },
      });
      if (old_group.length > 0) throw 'Already in group';

      const client_tutor = new ClientTutorEntity();
      client_tutor.student = groupDto.student;
      client_tutor.student_nick = groupDto.student_nick;
      client_tutor.teacher = groupDto.teacher;
      client_tutor.teacher_nick = groupDto.teacher_nick;
      client_tutor.group_name = groupDto.group_name;
      await client_tutor.save();
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
