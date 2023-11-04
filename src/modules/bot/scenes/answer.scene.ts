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
import { BotService } from '../bot.service';
import { ISession } from '../../../common/interfaces/session.interface';
import { UserEntity } from '../../user/entities/user.entity';
import { Context, Telegraf } from 'telegraf';

@Injectable()
@Scene('answer')
export class AnswerScene {
  constructor(
    private readonly botService: BotService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & ISession) {
    ctx.session.username = 'none';
    await ctx.reply('Отправь кому ответить');
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
  async toWhom(@Ctx() ctx: SceneContext & ISession) {
    if (ctx.session.username == 'none' || !ctx.session.username) {
      ctx.session.username = ctx.message['text'];
      console.log(ctx.message['text']);
      await ctx.reply('Что ответить');
    } else {
      console.log(ctx.message['text']);
      try {
        const username = ctx.session.username;
        console.log(username);
        const user = await UserEntity.findOneOrFail({
          where: { telegram_nick: username.substring(1) },
        });
        await ctx.copyMessage(user.telegram_id);
        ctx.session.username = 'none';
        await ctx.scene.enter('base');
      } catch (err) {
        console.log('ANSWER');
        console.log(err.message);
        console.log('ANSWER');
        await ctx.reply('Server problem');
      }
    }
  }
}
