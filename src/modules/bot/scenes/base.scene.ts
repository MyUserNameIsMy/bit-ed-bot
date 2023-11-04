import { Injectable } from '@nestjs/common';
import { Action, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotService } from '../bot.service';

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
}
