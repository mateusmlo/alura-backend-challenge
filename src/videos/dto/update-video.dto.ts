import { IsOptional } from 'class-validator';

export class UpdateVideoDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  url?: string;
}
