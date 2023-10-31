import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { AskQuestionScene } from './scenes/ask-question.scene';
import { BaseScene } from './scenes/base.scene';
import { SubmitHomeworkScene } from './scenes/submit-homework.scene';
import { PostNewsletterScene } from './scenes/post-newsletter.scene';
import { HttpModule } from '@nestjs/axios';
import { UserService } from '../user/user.service';

@Module({
  imports: [HttpModule],
  providers: [
    BotUpdate,
    BotService,
    BaseScene,
    AskQuestionScene,
    SubmitHomeworkScene,
    PostNewsletterScene,
    UserService,
  ],
})
export class BotModule {}
