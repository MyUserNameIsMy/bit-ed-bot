import { Injectable } from '@nestjs/common';
import { Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotService } from '../bot.service';
import { Context } from 'telegraf';
import { DirectusService } from '../../../common/services/directus.service';
import { IFolder } from '../../../common/interfaces/directus.interface';
import { ClientTutorEntity } from '../../group/entities/client-tutor.entity';
import { ISession } from '../../../common/interfaces/session.interface';
import { UserEntity } from '../../user/entities/user.entity';
import { RoleEnum } from '../../../common/enums/role.enum';

@Injectable()
@Scene('submitHomework')
export class SubmitHomeworkScene {
  constructor(
    private readonly botService: BotService,
    private readonly directusService: DirectusService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & ISession) {
    await ctx.replyWithHTML(
      `**Отправка домашнего задания. Отправьте домашнее задание в виде файлов или фото/скриншотов по одному.** *🚫 Текст не принимается.* **Убедитесь что получили сообщение файл принят для каждого отправленного файла.** **Для того чтобы выйти или завершить отправку, нажмите на** *Меню* **и выберите** *Меню бота* **или** *Главное меню*.`,
      {
        parse_mode: 'Markdown',
      },
    );
  }

  // @On(['photo', 'document'])
  // async file(@Ctx() ctx: Context & SceneContext) {
  //   try {
  //     const mimetype = ctx.message['photo']
  //       ? 'image/jpeg'
  //       : ctx.message['document']
  //       ? ctx.message['document'].mime_type
  //       : null;
  //
  //     const data = ctx.message['photo']?.pop() || ctx.message['document'];
  //     const url = await ctx.telegram.getFileLink(data.file_id);
  //     const client_tutor = await ClientTutorEntity.findOneOrFail({
  //       where: {
  //         student: ctx.message.from.id.toString(),
  //       },
  //     });
  //
  //     let folders: IFolder[] = await this.directusService.findAllFolders();
  //     if (
  //       !folders.find(
  //         (obj) =>
  //           obj.name === client_tutor.group_name + ' ' + client_tutor.teacher,
  //       )
  //     ) {
  //       await this.directusService.createFolder({
  //         name: client_tutor.group_name + ' ' + client_tutor.teacher,
  //         parent: null,
  //       });
  //     }
  //     await this.botService.delay(5000);
  //     folders = await this.directusService.findAllFolders();
  //     const tutor_folder = folders.find(
  //       (obj) =>
  //         obj.name === client_tutor.group_name + ' ' + client_tutor.teacher,
  //     );
  //     if (
  //       !folders.find(
  //         (obj) =>
  //           obj.name === ctx.session['hm'] && obj.parent === tutor_folder.id,
  //       )
  //     ) {
  //       await this.directusService.createFolder({
  //         name: ctx.session['hm'],
  //         parent: tutor_folder.id,
  //       });
  //     }
  //     await this.botService.delay(5000);
  //     folders = await this.directusService.findAllFolders();
  //     const hm_folder = folders.find(
  //       (obj) =>
  //         obj.name === ctx.session['hm'] && obj.parent === tutor_folder.id,
  //     );
  //     if (
  //       !folders.find(
  //         (obj) =>
  //           obj.name ===
  //             `${ctx.message.from.id} ${ctx.message.from.username}` &&
  //           obj.parent === hm_folder.id,
  //       )
  //     ) {
  //       await this.directusService.createFolder({
  //         name: `${ctx.message.from.id} ${ctx.message.from.username}`,
  //         parent: hm_folder.id,
  //       });
  //     }
  //     await this.botService.delay(5000);
  //     folders = await this.directusService.findAllFolders();
  //     const student_folder = folders.find(
  //       (obj) =>
  //         obj.name === `${ctx.message.from.id} ${ctx.message.from.username}` &&
  //         obj.parent === hm_folder.id,
  //     );
  //     console.log(student_folder);
  //     await this.directusService.importFile(
  //       url.toString(),
  //       student_folder.id,
  //       mimetype,
  //     );
  //     await ctx.reply('Файл Принят');
  //   } catch (err) {
  //     console.log(err.message);
  //     const admin = await UserEntity.findOneOrFail({
  //       where: {
  //         role: RoleEnum.ADMIN,
  //         telegram_nick: 'Skelet4on',
  //       },
  //     });
  //     await ctx.telegram.sendMessage(
  //       admin?.telegram_id,
  //       err.message + `${ctx.message.from.id} ${ctx.message.from.username}`,
  //     );
  //     await ctx.reply(
  //       'Возникли проблемы при отправке домашнего задания. Свяжитесь с техническим специалистом @DoubledBo.',
  //     );
  //   }
  // }
  @Hears('/menu')
  async returnBase(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('base');
  }

  @Hears('🏠 Главное меню')
  async returnBase2(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('base');
  }

  @On('message')
  async submitToChannel(@Ctx() ctx: Context & SceneContext) {
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
        `Teacher ${client_tutor.teacher} Student ${client_tutor.student} Hm ${ctx.session['hm']}`,
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
