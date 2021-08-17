import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { GetVideosFilterDto } from './dto/get-videos-filter.dto';
import { Video } from './entities/video.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@EntityRepository(Video)
export class VideosRepository extends Repository<Video> {
  private logger = new Logger('VideosRepository', { timestamp: true });

  async createVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    const { title, description, url, isFree } = createVideoDto;

    if (!createVideoDto.category)
      createVideoDto.category = { id: 1, ...createVideoDto.category };

    const newVideo = this.create({
      title,
      description,
      url,
      category: createVideoDto.category,
      isFree: isFree !== null ? isFree : null,
    });

    await this.save(newVideo);
    return newVideo;
  }

  async paginate(
    options: IPaginationOptions,
    filterDto: GetVideosFilterDto,
  ): Promise<Pagination<Video>> {
    const query = this.createQueryBuilder('v');

    // filterDto == video title
    if (filterDto !== undefined) {
      query.where('LOWER(v.title) LIKE LOWER(:title)', {
        title: `%${filterDto}%`,
      });
    }

    return paginate<Video>(query, options);
  }
}
