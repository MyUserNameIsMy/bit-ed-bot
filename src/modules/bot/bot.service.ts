import { Injectable } from '@nestjs/common';
import { InlineKeyboardMarkup } from 'telegraf/src/core/types/typegram';
import { UserEntity } from '../user/entities/user.entity';
import { In } from 'typeorm';
import { RoleEnum } from '../../common/enums/role.enum';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class BotService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}
  async showMenuButtons(): Promise<InlineKeyboardMarkup> {
    return {
      inline_keyboard: [
        [{ text: 'Задать вопрос', callback_data: 'question' }],
        [{ text: 'Сдать Домашку', callback_data: 'submit-homework' }],
        [{ text: 'Сделать Рассылку', callback_data: 'post-newsletter' }],
      ],
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
    for (const admin of admins) {
      await this.bot.telegram.sendMessage(
        admin.telegram_id,
        message + '@' + username,
      );
      await this.bot.telegram.forwardMessage(
        admin.telegram_id,
        chat_id,
        message_id,
      );
    }
  }
}
