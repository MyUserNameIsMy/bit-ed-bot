import { Injectable } from '@nestjs/common';
import { Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { BotService } from './bot.service';
import { SceneContext } from 'telegraf/typings/scenes';
import { UserService } from '../user/user.service';

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
    await ctx.reply(`Hi ${ctx.message.from.first_name}`);
    console.log(ctx.message);
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
}
