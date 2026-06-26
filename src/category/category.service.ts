import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category';
import { UpdateCategoryDto } from './dto/update-category';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }

  async findAllCategories() {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }

  async updateCategories(id: string, value: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: value,
      select: {
        name: true,
        slug: true,
      },
    });
  }

  async deleteCategories(id: string) {
    return this.prisma.category.delete({
      where: { id },
      select: {
        name: true,
        slug: true,
      },
    });
  }
}
