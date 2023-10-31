import { Injectable } from '@nestjs/common';
import { InlineKeyboardMarkup } from 'telegraf/src/core/types/typegram';

@Injectable()
export class BotService {
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
}
