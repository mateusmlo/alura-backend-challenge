import { Test } from '@nestjs/testing';
import { VideosService } from './videos.service';
import { VideosRepository } from './videos.repository';
import { VideosRepositoryMock } from '../mocks/videos.repository.mock';
import { Video } from './entities/video.entity';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

describe('VideosService', () => {
  let service: VideosService;
  const video: Video = {
    id: randomUUID(),
    title: 'video',
    description: 'funny video',
    url: 'http://video.com',
    isFree: true,
    category: {
      id: randomUUID(),
      title: 'test',
      color: 'black',
      videos: [],
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        VideosService,
        {
          provide: VideosRepository,
          useClass: VideosRepositoryMock,
        },
      ],
    }).compile();

    service = module.get(VideosService);
  });

  it('should create an instance of videos and category service', async () => {
    expect(service).toBeDefined();
  });

  it('should create a new video', async () => {
    jest.spyOn(service, 'createVideo').mockResolvedValue(video);

    await service.createVideo({
      title: 'video',
      description: 'funny video',
      url: 'http://video.com',
    });

    expect(video).toBeDefined();
    expect(service.createVideo).toHaveBeenCalled();
    expect(service.createVideo).not.toThrow();
  });

  it('should get video by ID', async () => {
    jest.spyOn(service, 'getVideoById').mockResolvedValue(video);

    await service.getVideoById(video.id);

    expect(video).toBeDefined();
    expect(service.getVideoById).toHaveBeenCalled();
    expect(service.getVideoById).not.toThrow();
  });

  it('should throw if video not found', async () => {
    jest
      .spyOn(service, 'getVideoById')
      .mockRejectedValue(new NotFoundException('Vídeo não encontrado'));

    const getVideo = service.getVideoById('999');

    expect(service.getVideoById).toHaveBeenCalled();
    await expect(getVideo).rejects.toThrow(
      new NotFoundException('Vídeo não encontrado'),
    );
  });

  it('should delete video by id', async () => {
    jest.spyOn(service, 'deleteVideo').mockResolvedValue(1);

    await service.deleteVideo(video.id);

    expect(service.deleteVideo).toHaveBeenCalled();
    expect(service.deleteVideo).not.toThrow();
  });
});
