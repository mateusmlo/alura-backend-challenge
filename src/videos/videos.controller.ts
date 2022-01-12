import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateVideoDto } from './dto/create-video.dto';
import { GetVideosFilterDto } from './dto/get-videos-filter.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './entities/video.entity';
import { VideosService } from './videos.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  private logger = new Logger('VideosController');
  constructor(private videosService: VideosService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'get videos',
    parameters: [
      {
        schema: { type: 'string' },
        name: 'title',
        in: 'query',
        required: false,
        example: 'cat video',
        description: 'search query to filter videos by name',
      },
      {
        schema: { type: 'number' },
        name: 'page',
        required: false,
        in: 'query',
        example: 1,
        description:
          'pagination option, selects page based on limit of returned data',
      },
      {
        schema: { type: 'number' },
        name: 'limit',
        in: 'query',
        required: false,
        example: 5,
        description:
          'pagination option, defines how many objects returned per page',
      },
    ],
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  getVideos(
    @Query('title') filterDto: GetVideosFilterDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ): Promise<Pagination<Video>> {
    return this.videosService.paginate({ page, limit }, filterDto);
  }

  @Get('/free')
  getFreeVideos(): Promise<Video[]> {
    return this.videosService.getFreeVideos();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createVideo(@Body() createVideoDto: CreateVideoDto): Promise<Video> {
    return this.videosService.createVideo(createVideoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getVideoById(@Param('id') id: string): Promise<Video> {
    return this.videosService.getVideoById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteVideo(@Param('id') id: string): Promise<number> {
    return this.videosService.deleteVideo(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  updateVideo(
    @Param('id') id: string,
    @Body() updateVideoDto: UpdateVideoDto,
  ): Promise<Video> {
    return this.videosService.updateVideo(id, updateVideoDto);
  }
}
