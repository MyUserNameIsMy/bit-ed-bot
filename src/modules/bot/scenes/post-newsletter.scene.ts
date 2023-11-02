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

@Injectable()
@Scene('postNewsLetter')
export class PostNewsletterScene {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Отправляй контент.');
  }

  @Hears('/menu')
  async returnBase(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('base');
  }

  @Hears('/stop')
  async stop(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('base');
  }

  @On('message')
  async onMessage(@Ctx() ctx: SceneContext) {
    const users = await UserEntity.find();
    for (const user of users) {
      await ctx.telegram.forwardMessage(
        user.telegram_id,
        ctx.message.chat.id,
        ctx.message.message_id,
      );
    }
  }
}
