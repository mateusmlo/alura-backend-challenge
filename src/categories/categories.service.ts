import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Video } from 'src/videos/entities/video.entity';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private categoriesRepository: CategoriesRepository,
  ) {}

  async getCategories(filterDto: GetCategoriesFilterDto): Promise<Category[]> {
    return this.categoriesRepository.getCategories(filterDto);
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesRepository.createCategory(createCategoryDto);
  }

  async getCategoryById(id: string): Promise<Category> {
    const result = await this.categoriesRepository.findOne(
      { id },
      { loadEagerRelations: false },
    );

    if (!result) throw new NotFoundException(`Categoria não encontrada.`);

    return result;
  }

  async getCategoryVideos(id: string) {
    const category = await this.categoriesRepository.findOne(
      { id },
      { relations: ['videos'] },
    );

    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.getCategoryById(id);

    const updatedCategory = {
      ...category,
      ...updateCategoryDto,
    };

    await this.categoriesRepository.save(updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<number> {
    const deletedCategory = await this.categoriesRepository.delete({ id });

    if (deletedCategory.affected === 0)
      throw new NotFoundException(`Categoria não encontrada.`);

    return deletedCategory.affected;
  }
}
