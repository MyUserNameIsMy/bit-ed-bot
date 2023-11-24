import { Action, Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { Injectable } from '@nestjs/common';
import { SceneContext } from 'telegraf/typings/scenes';
import { ISession } from '../../../common/interfaces/session.interface';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
@Scene('fio')
export class FioScene {
  constructor() {}

  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & ISession) {
    await ctx.reply(
      'Отправьте свое имя фамилию и если есть отчество с пробелами. *Азаматов Азамат Азаматович*',
      {
        parse_mode: 'Markdown',
      },
    );
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
  async fio(@Ctx() ctx: SceneContext & ISession) {
    try {
      ctx.session.fio = ctx.message['text'];
      console.log(ctx.message['text']);
      await ctx.reply(ctx.session.fio, {
        reply_markup: {
          inline_keyboard: [[{ text: 'Подтвердить', callback_data: 'accept' }]],
        },
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  @Action(/accept/)
  async accept(@Ctx() ctx: SceneContext & ISession) {
    try {
      const user = await UserEntity.findOneOrFail({
        where: {
          telegram_id: ctx.from.id.toString(),
        },
      });
      await ctx.deleteMessage();
      user.fio = ctx.session.fio;
      await user.save();
      await ctx.reply(`Имя принято. ${ctx.session.fio}`);
      ctx.session.fio = 'none';
      await ctx.scene.enter('base');
    } catch (err) {
      console.log(err.message);
    }
  }
}
