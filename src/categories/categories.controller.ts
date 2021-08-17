import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Video } from 'src/videos/entities/video.entity';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Controller('categorias')
export class CategoriesController {
  private logger = new Logger('CategoriesController');
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id/videos')
  getCategoryVideos(@Param('id') id: string) {
    return this.categoriesService.getCategoryVideos(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getCategories(
    @Query() filterDto: GetCategoriesFilterDto,
  ): Promise<Category[]> {
    return this.categoriesService.getCategories(filterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
