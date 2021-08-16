import { RedisService } from 'nestjs-redis';
import * as Redis from 'ioredis';
import * as bcrypt from 'bcrypt';
import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import IRedisProvider from 'src/auth/interfaces/redis-provider.interface';

@Injectable()
export class RedisProvider implements IRedisProvider {
  public client: Redis.Redis;
  constructor(private redisService: RedisService) {
    this.client = this.redisService.getClient('jwt');
  }

  async validateRefreshToken(uuid: string, token: string): Promise<boolean> {
    const tokenHash = await this.getTokenHash(uuid);
    await this.compareStoredTokenAndReceived(token, tokenHash);
    await this.deleteKey(uuid);
    return true;
  }

  async saveRefreshTokenHash(
    expireTime: number,
    uuid: string,
    refreshToken: string,
  ): Promise<'OK' | null> {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 14);
    return await this.client.set(uuid, refreshTokenHash, 'ex', expireTime);
  }

  public async deleteKey(uuid: string): Promise<boolean> {
    const success = await this.client.del(uuid);
    if (success != 1) {
      throw new InternalServerErrorException();
    }
    return true;
  }

  public async getTokenHash(uuid: string): Promise<string> {
    const tokenHash = await this.client.get(uuid);
    if (tokenHash == null) {
      throw new UnauthorizedException();
    }
    return tokenHash;
  }

  public async compareStoredTokenAndReceived(token: string, hash: string) {
    const splitedToken = token.split(' ');
    const hashMatch = await bcrypt.compare(splitedToken[1], hash);
    if (hashMatch !== true) {
      throw new UnauthorizedException();
    }
  }
}
