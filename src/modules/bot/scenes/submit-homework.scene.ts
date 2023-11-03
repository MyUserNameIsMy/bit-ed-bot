import { Injectable } from '@nestjs/common';
import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotService } from '../bot.service';

@Injectable()
@Scene('submitHomework')
export class SubmitHomeworkScene {
  constructor(private readonly botService: BotService) {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply(
      'На данный момент эта функция разрабатывается. 🚀Ожидайте апдейта. 🕒',
      {
        reply_markup: await this.botService.showKeyboardMenuButtons(),
      },
    );
    await ctx.scene.enter('base');
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
