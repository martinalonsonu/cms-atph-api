import { Injectable, NotFoundException } from '@nestjs/common';
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
        createdAt: true,
      },
    });
  }

  async findAllCategories(query: { page?: number; limit?: number }) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
        },
      }),
      this.prisma.category.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateCategories(id: string, value: UpdateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Categoría no encontrada');

    return this.prisma.category.update({
      where: { id },
      data: value,
      select: {
        id: true,
        name: true,
        slug: true,
        updatedAt: true,
      },
    });
  }

  async deleteCategories(id: string) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Categoría no encontrada');

    return this.prisma.category.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }
}
