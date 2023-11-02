import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CourseMaterialService } from './course-material.service';
import { CreateCourseMaterialDto } from './dto/create-course-material.dto';
import { UpdateCourseMaterialDto } from './dto/update-course-material.dto';

@Controller('course-material')
export class CourseMaterialController {
  constructor(private readonly courseMaterialService: CourseMaterialService) {}
}
