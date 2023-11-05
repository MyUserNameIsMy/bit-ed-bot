import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createMany: CreateUserDto[]) {
    return await this.userService.creatMany(createMany);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
