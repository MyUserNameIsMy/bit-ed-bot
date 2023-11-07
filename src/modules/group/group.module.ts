import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { ClientTutorEntity } from './entities/client-tutor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ClientTutorEntity])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
