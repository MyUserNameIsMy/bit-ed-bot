import { Controller, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { raw } from 'express';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async create() {
    return await this.groupService.create();
  }
}
