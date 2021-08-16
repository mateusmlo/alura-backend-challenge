import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(createUserDto);
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneOrFail(id, {
      where: {
        active: true,
      },
    });
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    if (!username || username.trim() === '') throw new BadRequestException();
    try {
      return await this.userRepository.findOneOrFail({ username });
    } catch (e) {
      throw new NotFoundException();
    }
  }

  async findByUsernameAndPass(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.findByUsername(username);
    const passIsValid = await bcrypt.compare(password, user.password);
    if (passIsValid) {
      user.password = undefined;
      return user;
    }
    throw new UnauthorizedException();
  }
}
