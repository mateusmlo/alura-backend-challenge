import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideosRepository } from './videos.repository';

@Module({
  imports: [TypeOrmModule.forFeature([VideosRepository])],
  providers: [VideosService],
  controllers: [VideosController],
})
export class VideosModule {}
