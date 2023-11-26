import { Body, Controller, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { ShareDto } from './dto/share.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  // @Post()
  // async createMany() {
  //   return await this.groupService.createGroups();
  // }

  @Post('share-link')
  async share(@Body() shareDto: ShareDto) {
    return await this.groupService.share(shareDto);
  }

  @Post()
  async create(@Body() groupDto: CreateGroupDto) {
    return await this.groupService.createGroup(groupDto);
  }

  // @Post('update-with-numbers')
  // async update() {
  //   return await this.groupService.updateWithNumbers();
  // }

  @Post('send-numbers')
  async sendMessage() {
    return await this.groupService.sendMessage();
  }

  @Post('generate-pdfs')
  async generatePDF() {
    return await this.groupService.generatePDF(
      'Қайыргелді Сұлтан Мұратұлы',
      '1010101001',
    );
  }
}
