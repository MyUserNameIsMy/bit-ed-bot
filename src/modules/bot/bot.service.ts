import { Injectable } from '@nestjs/common';
import {
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
} from 'telegraf/src/core/types/typegram';
import { UserEntity } from '../user/entities/user.entity';
import { In } from 'typeorm';
import { RoleEnum } from '../../common/enums/role.enum';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { SyllabusEntity } from '../course-material/entities/syllabus.entity';

@Injectable()
export class BotService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}
  async showMenuButtons(telegram_id: number): Promise<InlineKeyboardMarkup> {
    let show = false;
    try {
      const user = await UserEntity.findOneOrFail({
        where: { telegram_id: telegram_id.toString() },
      });
      if (user.role === RoleEnum.ADMIN) {
        show = true;
      }
    } catch (err) {
      console.log(err.message);
    }
    return {
      inline_keyboard: [
        [{ text: 'Задать вопрос', callback_data: 'question' }],
        [{ text: 'Загрузить все новости', callback_data: 'history' }],
        // [{ text: 'Сдать Домашку', callback_data: 'submit-homework' }],
        show
          ? [{ text: 'Сделать Рассылку', callback_data: 'post-newsletter' }]
          : [],
        show ? [{ text: 'Ответить', callback_data: 'answer' }] : [],
        show
          ? [{ text: 'Разослать историю', callback_data: 'history_send' }]
          : [],
      ],
    };
  }

  async showKeyboardMenuButtons(): Promise<ReplyKeyboardMarkup> {
    return {
      keyboard: [[{ text: '🏠 Главное меню' }]],
      resize_keyboard: true,
    };
  }

  async showSatisfyButtons(): Promise<InlineKeyboardMarkup> {
    return {
      inline_keyboard: [
        [{ text: 'Помогло', callback_data: 'helped' }],
        [{ text: 'Непонятно', callback_data: 'confused' }],
      ],
    };
  }

  async forwardToAdmins(
    message_id: number,
    chat_id: number,
    username: string,
    answered: boolean,
  ) {
    const admins = await UserEntity.find({
      where: {
        role: In([RoleEnum.ADMIN, RoleEnum.MANAGER]),
      },
    });
    let message = 'Новый вопрос от ';
    if (answered) {
      message = 'Вопрос отправлен на дополнение от ';
    }
    const channel = -4099440980;
    await this.bot.telegram.sendMessage(channel, message + '@' + username);
    await this.bot.telegram.forwardMessage(channel, chat_id, message_id);
    for (const admin of admins) {
      try {
        await this.bot.telegram.sendMessage(
          admin.telegram_id,
          message + '@' + username,
        );
        await this.bot.telegram.forwardMessage(
          admin.telegram_id,
          chat_id,
          message_id,
        );
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  async postNewsletters() {
    try {
      const users = await UserEntity.find();
      const currentDate = new Date();
      const currentDay = currentDate.getDate();

      const content = await SyllabusEntity.createQueryBuilder('s')
        .where(`EXTRACT(DAY FROM s.date) = :currentDay`, { currentDay })
        .getOne();

      for (const user of users) {
        try {
          await this.bot.telegram.sendMessage(user.telegram_id, content.text);
        } catch (e) {
          console.log(e.message);
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  }
}
