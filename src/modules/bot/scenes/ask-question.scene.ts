import {
  Action,
  Ctx,
  Hears,
  On,
  Scene,
  SceneEnter,
  SceneLeave,
} from 'nestjs-telegraf';
import { BadRequestException, Injectable, LoggerService } from '@nestjs/common';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotService } from '../bot.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { BASE_Q } from '../../../common/constants/url.constant';

@Injectable()
@Scene('askQuestion')
export class AskQuestionScene {
  constructor(
    private readonly botService: BotService,
    private readonly httpService: HttpService,
  ) {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Спроси меня');
  }

  @Hears('/menu')
  async returnBase(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('base');
  }

  @Action(/confused/)
  async confused(@Ctx() ctx: SceneContext) {
    await ctx.reply('Ваш вопрос направлен куратору');
    await ctx.scene.enter('base');
  }

  @Action(/helped/)
  async helped(@Ctx() ctx: SceneContext) {
    await ctx.reply('Спасибо возвращайтесь');
    await ctx.scene.enter('base');
  }

  @On('message')
  async answerToQuestion(@Ctx() ctx: SceneContext) {
    try {
      const question = ctx.message['text'];
      const { data } = await firstValueFrom(
        this.httpService
          .post<{ message: string }>(BASE_Q, {
            question: question,
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(error);
              throw 'An error happened!';
            }),
          ),
      );
      await ctx.reply(data.message, {
        reply_markup: await this.botService.showSatisfyButtons(),
      });
    } catch (err) {
      await ctx.reply('Server not responding.');
    }
  }
}
