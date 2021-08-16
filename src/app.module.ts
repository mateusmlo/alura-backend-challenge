import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/db.config';
import { VideosModule } from './videos/videos.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { authConfig } from './config/auth.config';
import { redisConfig } from './config/redis.config';
import { RedisModule } from 'nestjs-redis';
import { UserModule } from './user/user.module';
import { redisAuth } from './config/redis-auth.config';
import { jwtConstants } from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, authConfig, redisConfig, redisAuth, jwtConstants],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: configService.get<number>('port'),
        username: configService.get<string>('pgUser'),
        password: configService.get<string>('pgPassword'),
        database: configService.get<string>('db'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    VideosModule,
    CategoriesModule,
    AuthModule,
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get('redisStore'),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
