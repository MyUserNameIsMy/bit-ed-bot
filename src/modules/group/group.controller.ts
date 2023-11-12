import { Body, Controller, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  async createMany() {
    return await this.groupService.createGroups();
  }

  @Post()
  async create(@Body() groupDto: CreateGroupDto) {
    return await this.groupService.createGroup(groupDto);
  }
}
