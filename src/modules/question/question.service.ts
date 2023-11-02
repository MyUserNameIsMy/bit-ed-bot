import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionEntity } from './entities/question.entity';

@Injectable()
export class QuestionService {
  async create(createQuestionDto: CreateQuestionDto) {
    try {
      const question = new QuestionEntity();
      question.question_text = createQuestionDto.question_text
        .trim()
        .replace(/\s/g, '')
        .toLowerCase();
      question.who_asked = createQuestionDto.who_asked;
      await question.save();
    } catch (err) {
      return err.message;
    }
  }

  findAll() {
    return `This action returns all question`;
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
