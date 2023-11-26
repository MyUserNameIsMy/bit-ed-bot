import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  async creatMany(createMany: CreateUserDto[]) {
    for (const c of createMany) {
      try {
        await this.create(c);
      } catch (err) {
        console.error('CREATE MANY');
        console.error(err.message);
        console.error('CREATE MANY');
      }
    }
  }

  async verifyMany(verifyMany: CreateUserDto[]) {
    for (const verify of verifyMany) {
      try {
        const user = await UserEntity.findOneOrFail({
          where: { telegram_id: verify.telegram_id },
        });
        user.verified = true;
        await user.save();
      } catch (e) {
        console.log(e.message);
      }
    }
  }
  async create(createUserDto: CreateUserDto) {
    try {
      if (
        (
          await UserEntity.find({
            where: { telegram_id: createUserDto.telegram_id },
          })
        ).length > 0
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
  async findAll() {
    try {
      const users = await UserEntity.find();
      return {
        users,
        capacity: users.length,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
