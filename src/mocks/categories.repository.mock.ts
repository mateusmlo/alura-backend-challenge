import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { Category } from 'src/categories/entities/category.entity';

export class CategoriesRepositoryMock {
  createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return Promise.resolve({
      ...createCategoryDto,
    } as Category);
  }
}
