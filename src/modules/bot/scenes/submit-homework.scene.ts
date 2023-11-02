import { Injectable } from '@nestjs/common';
import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

@Injectable()
@Scene('submitHomework')
export class SubmitHomeworkScene {
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Отправляй домашку. Я жду.');
  }

  @Hears('/menu')
  async returnBase(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('base');
  }

  @Hears('/stop')
  async stop(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('base');
  }
}
