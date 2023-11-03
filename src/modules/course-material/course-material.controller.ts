import { Controller } from '@nestjs/common';
import { CourseMaterialService } from './course-material.service';

@Controller('course-material')
export class CourseMaterialController {
  constructor(private readonly courseMaterialService: CourseMaterialService) {}
}
