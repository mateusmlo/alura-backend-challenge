import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { GetVideosFilterDto } from './dto/get-videos-filter.dto';
import { Video } from './video.entity';

@EntityRepository(Video)
export class VideosRepository extends Repository<Video> {
  private logger = new Logger('VideosRepository', true);

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

  //! DTO não está validando as entradas por algum motivo
  async createVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    const { title, description, url } = createVideoDto;

    if (title === '' || description === '' || url === '')
      throw new BadRequestException('Preencha os campos obrigatórios');

    const newVideo = this.create({
      title,
      description,
      url,
    });

    await this.save(newVideo);
    return newVideo;
  }
}
