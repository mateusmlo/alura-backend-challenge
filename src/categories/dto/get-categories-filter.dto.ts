import { IsOptional, IsString } from 'class-validator';

export class GetCategoriesFilterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  color?: string;
}
