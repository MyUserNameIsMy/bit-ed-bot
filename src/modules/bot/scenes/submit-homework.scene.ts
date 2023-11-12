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
      `**Отправка домашнего задания. Отправьте домашнее задание в виде файлов или фото/скриншотов по одному.** *🚫 Текст не принимается.* **Для того чтобы выйти или завершить отправку, нажмите на** *Меню* **и выберите** *Меню бота* **или** *Главное меню*.`,
      {
        parse_mode: 'Markdown',
      },
    );
  }

  @On(['photo', 'document'])
  async file(@Ctx() ctx: Context & SceneContext) {
    try {
      const mimetype = ctx.message['photo']
        ? 'image/jpeg'
        : ctx.message['document']
        ? ctx.message['document'].mime_type
        : null;

      const data = ctx.message['photo']?.pop() || ctx.message['document'];
      const url = await ctx.telegram.getFileLink(data.file_id);
      const client_tutor = await ClientTutorEntity.findOneOrFail({
        where: {
          student: ctx.message.from.id.toString(),
        },
      });

      let folders: IFolder[] = await this.directusService.findAllFolders();
      if (
        !folders.find(
          (obj) =>
            obj.name === client_tutor.group_name + ' ' + client_tutor.teacher,
        )
      ) {
        await this.directusService.createFolder({
          name: client_tutor.group_name + ' ' + client_tutor.teacher,
          parent: null,
        });
      }

      folders = await this.directusService.findAllFolders();
      const tutor_folder = folders.find(
        (obj) =>
          obj.name === client_tutor.group_name + ' ' + client_tutor.teacher,
      );
      console.log(tutor_folder);
      if (
        !folders.find(
          (obj) =>
            obj.name === ctx.session['hm'] && obj.parent === tutor_folder.id,
        )
      ) {
        await this.directusService.createFolder({
          name: ctx.session['hm'],
          parent: tutor_folder.id,
        });
      }

      folders = await this.directusService.findAllFolders();
      const hm_folder = folders.find(
        (obj) =>
          obj.name === ctx.session['hm'] && obj.parent === tutor_folder.id,
      );
      if (
        !folders.find(
          (obj) =>
            obj.name ===
              `${ctx.message.from.id} ${ctx.message.from.username}` &&
            obj.parent === hm_folder.id,
        )
      ) {
        await this.directusService.createFolder({
          name: `${ctx.message.from.id} ${ctx.message.from.username}`,
          parent: hm_folder.id,
        });
      }

      folders = await this.directusService.findAllFolders();
      const student_folder = folders.find(
        (obj) =>
          obj.name === `${ctx.message.from.id} ${ctx.message.from.username}` &&
          obj.parent === hm_folder.id,
      );

      await this.directusService.importFile(
        url.toString(),
        student_folder.id,
        mimetype,
      );
    } catch (err) {
      const admin = await UserEntity.findOneOrFail({
        where: {
          role: RoleEnum.ADMIN,
          telegram_nick: 'Skelet4on',
        },
      });
      await ctx.telegram.sendMessage(admin?.telegram_id, err.message);
      await ctx.reply(
        'Возникли проблемы при отправке домашнего задания. Свяжитесь с техническим специалистом @DoubledBo.',
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
}
