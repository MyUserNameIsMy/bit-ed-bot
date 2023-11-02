import {
  Action,
  Ctx,
  Hears,
  InjectBot,
  On,
  Scene,
  SceneEnter,
} from 'nestjs-telegraf';
import { Injectable } from '@nestjs/common';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotService } from '../bot.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BASE_Q } from '../../../common/constants/url.constant';
import { QuestionService } from '../../question/question.service';
import { ISession } from '../../../common/interfaces/session.interface';
import { Context, Telegraf } from 'telegraf';

@Injectable()
@Scene('askQuestion')
export class AskQuestionScene {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly botService: BotService,
    private readonly httpService: HttpService,
    private readonly questionService: QuestionService,
  ) {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext) {
    await ctx.reply(
      '👋 Привет! Я здесь, чтобы помочь. У тебя есть какие-то вопросы или что-то, что ты хотел бы узнать? 🤔\n',
      {
        reply_markup: await this.botService.showKeyboardMenuButtons(),
      },
    );
  }

  @Hears('/menu')
  async returnBase1(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('base');
  }

  @Hears('🏠 Главное меню')
  async returnBase2(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter('base');
  }

  @Action(/confused/)
  async confused(@Ctx() ctx: SceneContext & ISession) {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    console.error(ctx);
    await this.botService.forwardToAdmins(
      ctx.session.question_id,
      ctx.session.chat_id,
      ctx.session.from,
      true,
    );
    await ctx.reply(
      'Спасибо за ваш вопрос! 🙏 Мы переслали его нашему куратору для более детального рассмотрения. 🕵️‍♂️ В ближайшее время вы получите ответ. 📬 Если у вас будут другие вопросы, не стесняйтесь задавать их. 🤔\n',
      {
        reply_markup: await this.botService.showKeyboardMenuButtons(),
      },
    );
    await ctx.scene.enter('base');
  }

  @Action(/helped/)
  async helped(@Ctx() ctx: SceneContext) {
    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
    await ctx.reply('Отлично! Рад был помочь! 🌟', {
      reply_markup: await this.botService.showKeyboardMenuButtons(),
    });
    await ctx.scene.enter('base');
  }

  @On('message')
  async answerToQuestion(@Ctx() ctx: SceneContext & ISession) {
    try {
      const question = ctx.message['text'];
      const { data } = await firstValueFrom(
        this.httpService.post<{ message: string; code: number }>(BASE_Q, {
          question: question,
        }),
      );
      ctx.session.question_id = ctx.message.message_id;
      ctx.session.chat_id = ctx.message.chat.id;
      ctx.session.from = ctx.message.from.username;

      if (data.code !== 200) {
        const new_question = {
          question_text: question || '',
          who_asked: ctx.message.from.id.toString(),
        };

        await this.botService.forwardToAdmins(
          ctx.message.message_id,
          ctx.message.chat.id,
          ctx.message.from.username,
          false,
        );
        await this.questionService.create(new_question);

        await ctx.reply(
          `${data.message} Вопрос сохранен и отправлен кураторам. Ожидайте ответа.`,
          {
            reply_markup: await this.botService.showKeyboardMenuButtons(),
          },
        );
      } else {
        await ctx.reply(data.message, {
          reply_markup: await this.botService.showSatisfyButtons(),
        });
      }
    } catch (err) {
      console.log(err);
      await ctx.reply('Server not responding.');
    }
  }
}
