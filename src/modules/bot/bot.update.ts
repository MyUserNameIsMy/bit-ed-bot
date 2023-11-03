import { Injectable } from '@nestjs/common';
import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { BotService } from './bot.service';
import { SceneContext } from 'telegraf/typings/scenes';
import { UserService } from '../user/user.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
@Update()
export class BotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly botService: BotService,
    private readonly userService: UserService,
  ) {}

  @Start()
  async start(@Ctx() ctx: SceneContext) {
    await ctx.reply(
      `👋 Добро пожаловать в ChinoeshSupportBot - твоего личного помощника по курсу арбитража! 📚💼
    
    Здесь ты можешь получить помощь по курсу арбитража, задать вопросы, получить домашние задания и дополнительные материалы. Если у тебя есть какие-либо вопросы, не стесняйся задавать их.
    
    Чтобы вызвать меню, напиши команду /menu. 🗂️🔍
    
    Удачи в обучении! 📚🌟 ${ctx.message.from.first_name}
    
    С уважением,
    ChinoeshSupportBot 🤖
    `,
      {
        reply_markup: await this.botService.showKeyboardMenuButtons(),
      },
    );
    const user = {
      firstname: ctx.message.from.first_name,
      lastname: ctx.message.from.last_name,
      phone: ctx.message.from.first_name,
      telegram_nick: ctx.message.from.username,
      telegram_id: ctx.message.from.id.toString(),
    };
    await this.userService.create(user);
    await ctx.scene.enter('base');
  }

  @Cron('58 3 * * *')
  async handleCron() {
    await this.botService.postNewsletters();
  }

  @Cron('33 3 * * *')
  async test() {
    await this.bot.telegram.sendMessage(860476763, 'Test cron');
  }
}
