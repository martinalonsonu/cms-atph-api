import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category';
import { UpdateCategoryDto } from './dto/update-category';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAllCategories();
  }

  @Patch()
  updateUser(@Query('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.updateCategories(id, dto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.categoryService.deleteCategories(id);
  }
}
