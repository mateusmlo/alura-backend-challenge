import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../user/users.repository';
import { RedisProvider } from './strategies/refresh/redis.provider';
import { RefreshTokenStrategy } from './strategies/refresh/refresh-token.strategy';
import { LocalStrategy } from './strategies/local/local.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthController,
    JwtStrategy,
    RedisProvider,
    RefreshTokenStrategy,
    LocalStrategy,
  ],
  imports: [
    TypeOrmModule.forFeature([UsersRepository]),
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.register({}),
  ],
  exports: [AuthService],
})
export class AuthModule {}
