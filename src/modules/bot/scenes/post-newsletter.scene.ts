import { Injectable } from '@nestjs/common';
import {
  Action,
  Ctx,
  Hears,
  InjectBot,
  On,
  Scene,
  SceneEnter,
} from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Context, Telegraf } from 'telegraf';
import { UserEntity } from '../../user/entities/user.entity';
import { BotService } from '../bot.service';

@Injectable()
@Scene('postNewsLetter')
export class PostNewsletterScene {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly botService: BotService,
  ) {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Отправляй контент.', {
      reply_markup: await this.botService.showKeyboardMenuButtons(),
    });
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
  async onMessage(@Ctx() ctx: SceneContext) {
    const users = await UserEntity.find();
    for (const user of users) {
      await ctx.copyMessage(user.telegram_id);
    }
  }
}
