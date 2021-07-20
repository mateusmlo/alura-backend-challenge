import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateVideoDto } from './dto/create-video.dto';
import { GetVideosFilterDto } from './dto/get-videos-filter.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { Video } from './video.entity';
import { VideosRepository } from './videos.repository';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(VideosRepository)
    private videosRepository: VideosRepository,
  ) {}

  async getVideos(filterDto: GetVideosFilterDto): Promise<Video[]> {
    return this.videosRepository.getVideos(filterDto);
  }

  async createVideo(createVideoDto: CreateVideoDto): Promise<Video> {
    return this.videosRepository.createVideo(createVideoDto);
  }

  async getVideoById(id: string): Promise<Video> {
    const result = await this.videosRepository.findOne({ id });

    if (!result) throw new NotFoundException(`Vídeo não encontrado`);

    return result;
  }

  async deleteVideo(id: string): Promise<number> {
    const deletedVideo = await this.videosRepository.delete({ id });

    if (deletedVideo.affected === 0)
      throw new NotFoundException(`Vídeo não encontrado`);

    return deletedVideo.affected;
  }

  async updateVideo(
    id: string,
    updateVideoDto: UpdateVideoDto,
  ): Promise<Video> {
    const video = await this.getVideoById(id);

    const updatedVideo = {
      ...video,
      ...updateVideoDto,
    };

    await this.videosRepository.save(updatedVideo);
    return updatedVideo;
  }
}
