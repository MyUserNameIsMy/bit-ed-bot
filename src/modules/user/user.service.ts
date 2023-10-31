import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto) {
    try {
      if (
        !(await UserEntity.find({
          where: { telegram_id: createUserDto.telegram_id },
        }))
      ) {
        return;
      }
      const user = new UserEntity();
      user.firstname = createUserDto.firstname;
      user.lastname = createUserDto.lastname;
      user.telegram_id = createUserDto.telegram_id;
      user.telegram_nick = createUserDto.telegram_nick;
      await user.save();
    } catch (err) {
      return {
        message: err.message,
      };
    }
  }
}
