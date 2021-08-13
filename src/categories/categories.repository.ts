import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Video } from 'src/videos/entities/video.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { Category } from './entities/category.entity';

@EntityRepository(Category)
export class CategoriesRepository extends Repository<Category> {
  private logger = new Logger('CategoriesRepository', true);

  async getCategories(filterDto: GetCategoriesFilterDto): Promise<Category[]> {
    const { title, color } = filterDto;

    const query = this.createQueryBuilder('c');

    if (title)
      query.where('LOWER(c.title) LIKE LOWER(:title)', { title: `%${title}%` });

    if (color)
      query.where('LOWER(c.color) LIKE LOWER(:color)', {
        color: `%${color}%`,
      });

    try {
      const categories = await query.getMany();
      return categories;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { title, color } = createCategoryDto;

    if (title === '' || color === '')
      throw new BadRequestException(`Os campos são obrigatórios.`);

    const newCategory = this.create({
      title,
      color,
    });

    await this.save(newCategory);
    return newCategory;
  }
}
