import { Injectable } from '@nestjs/common';
import { Ctx, Hears, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { Context, Telegraf } from 'telegraf';
import { UserEntity } from '../../user/entities/user.entity';
import { BotService } from '../bot.service';
import { HistoryEntity } from '../../history/entities/history.entity';
import { RoleEnum } from '../../../common/enums/role.enum';

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
    let admin = null;
    try {
      const history = new HistoryEntity();
      history.message_id = ctx.message.message_id.toString();
      history.chat_id = ctx.message.chat.id.toString();
      await history.save();
      admin = await UserEntity.findOneOrFail({
        where: {
          role: RoleEnum.ADMIN,
          telegram_nick: 'Skelet4on',
        },
      });
    } catch (err) {
      await ctx.telegram.sendMessage(admin?.telegram_id, err.message);
    }
    //const users = await UserEntity.find();
    // for (const user of users) {
    //   try {
    //     await ctx.copyMessage(user.telegram_id);
    //   } catch (err) {
    //     console.log(err.message);
    //   }
    // }
  }
}
