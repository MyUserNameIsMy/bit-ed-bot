import { Injectable } from '@nestjs/common';
import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotService } from '../bot.service';
import { HistoryEntity } from '../../history/entities/history.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
@Scene('base')
export class BaseScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    try {
      const telegram_id = ctx.message.from.id;
      await ctx.reply('Меню', {
        reply_markup: await this.botService.showMenuButtons(telegram_id),
      });
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
