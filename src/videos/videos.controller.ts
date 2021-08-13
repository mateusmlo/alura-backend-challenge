import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { GetVideosFilterDto } from './dto/get-videos-filter.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { VideosService } from './videos.service';

@Controller('videos')
export class VideosController {
  private logger = new Logger('VideosController');
  constructor(private videosService: VideosService) {}

  @Get()
  getVideos(@Query() filterDto: GetVideosFilterDto): Promise<Video[]> {
    return this.videosService.getVideos(filterDto);
  }

  @Post()
  createVideo(@Body() createVideoDto: CreateVideoDto): Promise<Video> {
    return this.videosService.createVideo(createVideoDto);
  }

  @Get('/:id')
  getVideoById(@Param('id') id: string): Promise<Video> {
    return this.videosService.getVideoById(id);
  }

  @Delete('/:id')
  deleteVideo(@Param('id') id: string): Promise<number> {
    return this.videosService.deleteVideo(id);
  }

  @Patch('/:id')
  updateVideo(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<Video> {
    return this.videosService.updateVideo(id, updateVideoDto);
  }
}
