import { Injectable } from '@nestjs/common';
import { Ctx, Hears, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { ISession } from '../../../common/interfaces/session.interface';

@Injectable()
@Scene('submitReport')
export class SubmitReportScene {
  constructor() {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & ISession) {
    await ctx.reply(
      `**Отправьте отчет в ввиде файлов или фото/скриншотов или текста. Для того чтобы выйти или завершить отправку нажмите на ** *Меню* **и** *Меню бота* **или** *Главное меню.*`,
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
  async echoChannel(@Ctx() ctx: SceneContext & ISession) {
    await ctx.forwardMessage('-4085369060');
  }
}
