import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { PostgresErrorCodes } from 'src/errors/pgErrorCodes.enum';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = this.create({
        username,
        password: hashedPassword,
      });
      await this.save(user);

      return user;
    } catch (error) {
      if (error.code === PostgresErrorCodes.UniqueViolation)
        throw new ConflictException('Este nome de usuário já existe.');

      throw new InternalServerErrorException();
    }
  }
}
