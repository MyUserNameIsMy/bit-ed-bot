import { Module } from '@nestjs/common';
import { BotUpdate } from './modules/bot/bot.update';
import { UserModule } from './modules/user/user.module';
import { BotModule } from './modules/bot/bot.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getOrmAsyncConfig } from './config/orm-async.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from './config/jwt.config';
import { TelegrafModule } from 'nestjs-telegraf';
import { getTelegrafAsyncConfig } from './config/telegraf-async.config';
import { HttpModule } from '@nestjs/axios';
import { QuestionModule } from './modules/question/question.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(getOrmAsyncConfig()),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync(getJWTConfig()),
    TelegrafModule.forRootAsync(getTelegrafAsyncConfig()),

    UserModule,
    BotModule,
    QuestionModule,
  ],
  controllers: [],
})
export class AppModule {}
