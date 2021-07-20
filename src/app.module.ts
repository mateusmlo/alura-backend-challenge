import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'aluraflix',
      autoLoadEntities: true,
      synchronize: true,
    }),
    VideosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
