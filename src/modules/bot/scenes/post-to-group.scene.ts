import { Injectable } from '@nestjs/common';
import { Ctx, Hears, InjectBot, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { BotService } from '../bot.service';
import { ISession } from '../../../common/interfaces/session.interface';
import { UserEntity } from '../../user/entities/user.entity';
import { Context, Telegraf } from 'telegraf';
import { ClientTutorEntity } from '../../group/entities/client-tutor.entity';
import { RoleEnum } from '../../../common/enums/role.enum';

@Injectable()
@Scene('postToGroup')
export class PostToGroupScene {
  constructor(
    private readonly botService: BotService,
    @InjectBot() private readonly bot: Telegraf<Context>,
  ) {}
  @SceneEnter()
  async enter(@Ctx() ctx: SceneContext & ISession) {
    ctx.session.username = 'none';
    await ctx.reply('Отправь какой группе ответить');
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
    if (ctx.session.group_name == 'none' || !ctx.session.group_name) {
      ctx.session.group_name = ctx.message['text'];
      console.log(ctx.message['text']);
      await ctx.reply('Что разослать');
    } else {
      console.log(ctx.message['text']);
      try {
        const group_name = ctx.session.group_name;

        const client_tutors = await ClientTutorEntity.find({
          where: {
            group_name: group_name,
          },
        });

        for (const client_tutor of client_tutors) {
          try {
            await ctx.copyMessage(client_tutor.student);
          } catch (err) {
            const admin = await UserEntity.findOneOrFail({
              where: {
                role: RoleEnum.ADMIN,
                telegram_nick: 'Skelet4on',
              },
            });
            await ctx.telegram.sendMessage(
              admin?.telegram_id,
              err.message +
                `${ctx.message.from.id} ${ctx.message.from.username}`,
            );
          }
        }
        ctx.session.group_name = 'none';
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
