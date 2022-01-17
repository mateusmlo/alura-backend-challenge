import { randomUUID } from 'crypto';
import { CreateVideoDto } from 'src/videos/dto/create-video.dto';
import { Video } from 'src/videos/entities/video.entity';

export class VideosRepositoryMock {
  createVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    return Promise.resolve({
      id: randomUUID(),
      ...createVideoDto,
    } as Video);
  }
}
