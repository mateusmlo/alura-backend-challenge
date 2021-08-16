import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { GetVideosFilterDto } from './dto/get-videos-filter.dto';
import { Video } from './entities/video.entity';

@EntityRepository(Video)
export class VideosRepository extends Repository<Video> {
  private logger = new Logger('VideosRepository', { timestamp: true });

  async getVideos(filterDto: GetVideosFilterDto): Promise<Video[]> {
    const { title } = filterDto;

    const query = this.createQueryBuilder('v');
    if (title)
      query.where('LOWER(v.title) LIKE LOWER(:title)', { title: `%${title}%` });

    try {
      const videos = await query.getMany();
      return videos;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async createVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    const { title, description, url } = createVideoDto;

    if (title === '' || description === '' || url === '')
      throw new BadRequestException('Preencha os campos obrigatórios');

    if (!createVideoDto.category)
      createVideoDto.category = { id: 1, ...createVideoDto.category };

    const newVideo = this.create({
      title,
      description,
      url,
      category: createVideoDto.category,
    });

    await this.save(newVideo);
    return newVideo;
  }
}
