import { Module } from '@nestjs/common';
import { CourseMaterialService } from './course-material.service';
import { CourseMaterialController } from './course-material.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyllabusEntity } from './entities/syllabus.entity';
import { HomeworkEntity } from './entities/homework.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SyllabusEntity, HomeworkEntity])],
  controllers: [CourseMaterialController],
  providers: [CourseMaterialService],
})
export class CourseMaterialModule {}
