import { IsBooleanString, IsNotEmpty, IsOptional } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';

export class CreateVideoDto {
  @IsNotEmpty({ message: 'Título não pode estar em branco' })
  title: string;

  @IsNotEmpty({ message: 'Descrição não pode estar em branco' })
  description: string;

  @IsNotEmpty({ message: 'URL não pode estar em branco' })
  url: string;

  @IsOptional()
  category?: Category;

  @IsOptional()
  @IsBooleanString({
    message:
      'isFree deve ser um boolean de valor true. Caso contrário, não é necessário informar.',
  })
  isFree?: boolean;
}
