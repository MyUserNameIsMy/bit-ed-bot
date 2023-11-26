import { Module } from '@nestjs/common';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { AskQuestionScene } from './scenes/ask-question.scene';
import { BaseScene } from './scenes/base.scene';
import { SubmitHomeworkScene } from './scenes/submit-homework.scene';
import { PostNewsletterScene } from './scenes/post-newsletter.scene';
import { HttpModule } from '@nestjs/axios';
import { UserService } from '../user/user.service';
import { QuestionService } from '../question/question.service';
import { AnswerScene } from './scenes/answer.scene';
import { DirectusService } from '../../common/services/directus.service';
import { SubmitReportScene } from './scenes/submit-report.scene';
import { PostToGroupScene } from './scenes/post-to-group.scene';
import { FioScene } from './scenes/fio.scene';
import { GroupService } from '../group/group.service';

@Module({
  imports: [HttpModule],
  providers: [
    BotUpdate,
    BotService,
    BaseScene,
    AskQuestionScene,
    SubmitHomeworkScene,
    PostNewsletterScene,
    AnswerScene,
    SubmitReportScene,
    PostToGroupScene,
    FioScene,
    UserService,
    QuestionService,
    DirectusService,
    GroupService,
  ],
})
export class BotModule {}
