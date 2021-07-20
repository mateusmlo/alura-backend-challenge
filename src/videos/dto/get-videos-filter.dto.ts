import { IsOptional, IsString } from 'class-validator';

export class GetVideosFilterDto {
  @IsOptional()
  @IsString()
  title?: string;
}
