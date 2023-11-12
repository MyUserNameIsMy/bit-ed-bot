import { Injectable } from '@nestjs/common';
import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotService } from '../bot.service';
import { HistoryEntity } from '../../history/entities/history.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ClientTutorEntity } from '../../group/entities/client-tutor.entity';
import { ISession } from '../../../common/interfaces/session.interface';
import { RoleEnum } from '../../../common/enums/role.enum';
import { In } from 'typeorm';

@Injectable()
@Scene('base')
export class BaseScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    try {
      const telegram_id = ctx.message.from.id;
      const user = await UserEntity.findOne({
        where: {
          telegram_id: telegram_id.toString(),
          role: In[(RoleEnum.USER, RoleEnum.ADMIN)],
        },
      });
      console.log(user);
      await ctx.reply(
        `${
          ctx.message.from.first_name
        } ${this.botService.getRandomAnimalEmoji()}.\n` +
          (user ? `Текущий баланс ${user?.balance} coins.` : ''),
        {
          reply_markup: await this.botService.showMenuButtons(telegram_id),
        },
      );
    } catch (err) {
      console.log(err.message);
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

  @Action(/question/)
  async onQuestion(@Ctx() ctx: SceneContext) {
    try {
      await ctx.deleteMessage();
    } catch (err) {
      console.error(err.message);
    }
    await ctx.scene.enter('askQuestion');
  }

  @Action(/submit-homework/)
  async onSubmitHomework(@Ctx() ctx: SceneContext) {
    try {
      await ctx.deleteMessage();
    } catch (err) {
      console.error(err.message);
    }

    await ctx.reply('Выберите домашнеее задание которое хотите отправить', {
      reply_markup: await this.botService.chooseHomework(),
    });
  }

  @Action(/submit-report/)
  async onSubmitReport(@Ctx() ctx: SceneContext) {
    try {
      await ctx.deleteMessage();
    } catch (err) {
      console.error(err.message);
    }

    await ctx.scene.enter('submitReport');
  }

  @Action(/hm-/)
  async onChooseHomework(@Ctx() ctx: SceneContext & ISession) {
    try {
      await ctx.deleteMessage();
    } catch (err) {
      console.error(err.message);
    }
    console.log(ctx.update['callback_query']['data']);
    ctx.session['hm'] = ctx.update['callback_query']['data'];
    await ctx.scene.enter('submitHomework');
  }
  @Action(/post-newsletter/)
  async onPostNewsLetter(@Ctx() ctx: SceneContext) {
    try {
      await ctx.deleteMessage();
    } catch (err) {
      console.error(err.message);
    }
    await ctx.scene.enter('postNewsLetter');
  }

  @Action(/answer/)
  async onAnswer(@Ctx() ctx: SceneContext) {
    try {
      await ctx.deleteMessage();
    } catch (err) {
      console.error(err.message);
    }
    await ctx.scene.enter('answer');
  }

  @Action(/history/)
  async onHistory(@Ctx() ctx: SceneContext) {
    try {
      await ctx.deleteMessage();
    } catch (err) {
      console.error(err.message);
    }
    try {
      const history = await HistoryEntity.find();
      for (const h of history) {
        try {
          await ctx.telegram.copyMessage(
            ctx.chat.id,
            h.chat_id,
            Number(h.message_id),
          );
        } catch (err) {
          continue;
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  @Action(/contact/)
  async contact(@Ctx() ctx: SceneContext) {
    try {
      console.log(ctx.chat);
      const client_tutor = await ClientTutorEntity.findOneOrFail({
        where: { student: ctx.chat.id.toString() },
      });
      await ctx.reply(`Ваш куратор @${client_tutor.teacher_nick}`);
    } catch (err) {
      await ctx.reply('Проблемы со связью');
    }
  }
  @Action(/magic/)
  async onHistorySend(@Ctx() ctx: SceneContext) {
    try {
      await ctx.deleteMessage();
    } catch (err) {
      console.error(err.message);
    }
    try {
      const history = await HistoryEntity.find();
      const users = await UserEntity.find();
      for (const user of users) {
        try {
          for (const h of history) {
            try {
              await ctx.telegram.copyMessage(
                user.telegram_id,
                h.chat_id,
                Number(h.message_id),
              );
            } catch (err) {
              continue;
            }
          }
        } catch (e) {
          continue;
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  }
}
