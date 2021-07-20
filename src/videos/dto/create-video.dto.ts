import { IsNotEmpty } from 'class-validator';

export class CreateVideoDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  url: string;
}
