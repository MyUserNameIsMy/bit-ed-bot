import { Injectable } from '@nestjs/common';
import { Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { ISession } from '../../../common/interfaces/session.interface';
import { ClientTutorEntity } from '../../group/entities/client-tutor.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { RoleEnum } from '../../../common/enums/role.enum';
import * as fs from 'fs';

@Injectable()
@Scene('submitReport')
export class SubmitReportScene {
  constructor() {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & ISession) {
    try {
      await ctx.reply(
        `**Отправьте отчет в ввиде файлов или фото/скриншотов или текста. Для того чтобы выйти или завершить отправку нажмите на ** *Меню* **и** *Меню бота* **или** *Главное меню.* **Ниже приложен пример файла для заполнения.**`,
        {
          parse_mode: 'Markdown',
        },
      );
      const filepath = 'src/common/assets/отчетность марафон.xlsx';
      const buffer = fs.readFileSync(filepath);
      await ctx.sendDocument({
        source: buffer,
        filename: 'отчетность марафон.xlsx',
      });
    } catch (e) {
      await ctx.reply(
        'Server not responding for this request. https://t.me/DoubledBo',
      );
    }
  }
  @Hears('/menu')
  async returnBase(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('base');
  }

  @Hears('🏠 Главное меню')
  async returnBase2(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('base');
  }

  @On('message')
  async echoChannel(@Ctx() ctx: SceneContext & ISession) {
    try {
      const groups = {
        '1234739810': -1002040594282,
        '1558985661': -4029859691,
        '944933464': -4026549402,
        '1430293320': -4061561732,
        '826977066': -4073654956,
        '6271691985': -4036147486,
        '617003029': -4030334404,
        magic: -1002040594282,
      };
      const client_tutor = await ClientTutorEntity.findOneOrFail({
        where: {
          student: ctx.message.from.id.toString(),
        },
      });

      await ctx.telegram.sendMessage(
        groups[client_tutor.teacher],
        `Teacher ${client_tutor.teacher} Student ${
          client_tutor.student
        } Report report-${new Date().toLocaleDateString()}`,
      );

      await ctx.copyMessage(groups[client_tutor.teacher]);
      await ctx.reply('Файл принят');
    } catch (err) {
      console.log(err.message);
      const admin = await UserEntity.findOneOrFail({
        where: {
          role: RoleEnum.ADMIN,
          telegram_nick: 'Skelet4on',
        },
      });
      await ctx.telegram.sendMessage(
        admin?.telegram_id,
        err.message + `${ctx.message.from.id} ${ctx.message.from.username}`,
      );
      await ctx.reply(
        'Возникли проблемы при отправке домашнего задания. Свяжитесь с техническим специалистом @DoubledBo.',
      );
    }
  }
}
