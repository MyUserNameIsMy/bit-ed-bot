import { Injectable } from '@nestjs/common';
import {
  Action,
  Ctx,
  Hears,
  InjectBot,
  Scene,
  SceneEnter,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotService } from '../bot.service';
import { HistoryEntity } from '../../history/entities/history.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ClientTutorEntity } from '../../group/entities/client-tutor.entity';
import { ISession } from '../../../common/interfaces/session.interface';
import { RoleEnum } from '../../../common/enums/role.enum';
import { In, MoreThanOrEqual } from 'typeorm';
import { HomeworkEntity } from '../../course-material/entities/homework.entity';
import { ClientHomeworkEntity } from '../../user/entities/client-homework.entity';
import { Cron } from '@nestjs/schedule';
import { Context, Telegraf } from 'telegraf';

@Injectable()
@Scene('base')
export class BaseScene {
  constructor(
    private readonly botService: BotService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    try {
      const telegram_id = ctx.from.id;
      const user = await UserEntity.findOne({
        where: {
          telegram_id: telegram_id.toString(),
          role: In[(RoleEnum.USER, RoleEnum.ADMIN)],
        },
      });
      const homeworks = await ClientHomeworkEntity.find({
        where: { student: telegram_id.toString() },
      });
      console.log(ctx.message.from.username);
      if (ctx.from.username && ctx.from.username != user.telegram_nick) {
        user.telegram_nick = ctx.from.username;
      }
      user.balance = homeworks.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.score;
      }, 0);
      await user.save();
      await ctx.reply(
        `${ctx.from.first_name} ${this.botService.getRandomAnimalEmoji()}.\n` +
          (user ? `Текущий баланс ${user?.balance} баллов.` : '') +
          (user?.fio ? `\nФИО ${user?.fio}.` : '') +
          (user?.fio && user?.comp_number >= 100 && user?.comp_number <= 500
            ? `\nУникальный номер ${user?.comp_number}.`
            : ''),
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

    await ctx.reply(
      'Выберите домашнеее задание которое хотите отправить.\n🔴 означает что время отправки прошло.\n🟢 означает можно еще сдавать.',
      {
        reply_markup: await this.botService.chooseHomework(),
      },
    );
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
    const hm = ctx.update['callback_query']['data'];
    const hm_id = hm.replace(/\D/g, '');
    if (hm == 'hm-0') {
      await ctx.replyWithHTML(`*Время отправки домашнего задания прошло.*`, {
        parse_mode: 'Markdown',
      });
      await ctx.scene.enter('base');
      return;
    }
    const homework = await HomeworkEntity.findOne({ where: { id: hm_id } });

    await ctx.reply(homework.text);
    await ctx.reply(
      '**Для того чтобы выйти или завершить отправку, нажмите на** *Меню* **и выберите** *Меню бота* **или** *Главное меню*. *Чтобы начать сдачу домашки нажмите приложить файлы.*',
      {
        parse_mode: 'Markdown',
        reply_markup: await this.botService.showHomeworkButton(),
      },
    );
  }

  @Action(/submit-hm/)
  async enterSubmitHm(@Ctx() ctx: SceneContext & ISession) {
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

  @Action(/post-to-group/)
  async onPostToGroup(@Ctx() ctx: SceneContext) {
    try {
      await ctx.deleteMessage();
    } catch (err) {
      console.error(err.message);
    }
    await ctx.scene.enter('postToGroup');
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

  @Action(/fio/)
  async onFio(@Ctx() ctx: SceneContext) {
    try {
      await ctx.deleteMessage();
    } catch (err) {
      console.error(err.message);
    }
    await ctx.scene.enter('fio');
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
      if (
        ctx.from?.username &&
        ctx.from?.username != client_tutor.student_nick
      ) {
        client_tutor.student_nick = ctx.from.username;
      }
      const user = await UserEntity.findOne({
        where: { telegram_id: client_tutor.teacher },
      });
      if (
        user?.telegram_nick &&
        client_tutor.teacher_nick != user?.telegram_nick
      ) {
        client_tutor.teacher_nick = user?.telegram_nick;
      }
      await client_tutor.save();
      await ctx.reply(`Ваш куратор @${client_tutor.teacher_nick}`);
    } catch (err) {
      console.log(err);
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

  @Cron('0 */3 * * *')
  async repeater() {
    const admin = await UserEntity.findOneOrFail({
      where: {
        role: RoleEnum.ADMIN,
        telegram_nick: 'Skelet4on',
      },
    });
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const history = await HistoryEntity.find({
        where: {
          created_at: MoreThanOrEqual(today),
        },
      });
      const users = await UserEntity.find();
      for (const user of users) {
        try {
          for (const h of history) {
            try {
              await this.bot.telegram.copyMessage(
                user.telegram_id,
                h.chat_id,
                Number(h.message_id),
              );
            } catch (err) {
              await this.bot.telegram.sendMessage(
                admin?.telegram_id,
                err.message + `${user.telegram_id} ${user.telegram_nick}`,
              );
              continue;
            }
          }
        } catch (e) {
          await this.bot.telegram.sendMessage(
            admin?.telegram_id,
            e.message + `${user.telegram_id} ${user.telegram_nick}`,
          );
          continue;
        }
      }
    } catch (err) {
      await this.bot.telegram.sendMessage(admin?.telegram_id, err.message);
      console.error(err.message);
    }
  }
}
