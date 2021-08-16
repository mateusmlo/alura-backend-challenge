import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../user/users.repository';

import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { RedisProvider } from './strategies/refresh/redis.provider';
import { User } from 'src/user/entities/user.entity';
import ILoginResponse from './interfaces/login-res.interface';
import ILoginPayload from './interfaces/login-payload.interface';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly refreshTokenRedisExpireTime: number;
  private accessJwtSignOptions: JwtSignOptions;
  private refreshJwtSignOptions: JwtSignOptions;
  private logger = new Logger();

  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisProvider: RedisProvider,
  ) {
    this.refreshTokenRedisExpireTime = this.configService.get(
      'redisAuth.redisExpireTime',
    );
    this.accessJwtSignOptions = {
      ...this.configService.get('jwtConstants.accessTokenConstants'),
    };
    this.refreshJwtSignOptions = {
      ...this.configService.get('jwtConstants.refreshTokenConstants'),
    };
  }

  async getUserByUsernameAndPassword(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    return user;
  }

  async login(user: User): Promise<ILoginResponse> {
    const payload = { sub: user.id, username: user.username };
    const uuid = this.generateUuidSession();
    return {
      access_token: this.signAccess(payload),
      refresh_token: await this.generateRefresh(user, uuid),
      session_id: uuid,
      user_id: user.id,
    } as ILoginResponse;
  }

  private signAccess(payload: ILoginPayload): string {
    return this.jwtService.sign(payload, this.accessJwtSignOptions);
  }

  private signRefresh(payload: ILoginPayload): string {
    return this.jwtService.sign(payload, this.refreshJwtSignOptions);
  }

  private generateUuidSession(): string {
    return uuidV4();
  }

  private async generateRefresh(user: User, uuid: string): Promise<string> {
    const payload = { uuid: uuid, sub: user.id, username: user.username };
    const refreshToken = this.signRefresh(payload);
    await this.saveRefreshTokenHash(uuid, refreshToken);
    return refreshToken;
  }

  private async saveRefreshTokenHash(uuid: string, refreshToken: string) {
    const saved = await this.redisProvider.saveRefreshTokenHash(
      this.refreshTokenRedisExpireTime,
      uuid,
      refreshToken,
    );
    if (!saved) {
      throw new InternalServerErrorException();
    }
  }
}
