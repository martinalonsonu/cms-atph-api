import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async createTag(data: CreateTagDto) {
    return this.prisma.tag.create({
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

  async findAllTags(query: { page?: number; limit?: number }) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.tag.findMany({
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
      this.prisma.tag.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateTag(id: string, value: UpdateTagDto) {
    const existing = await this.prisma.tag.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Etiqueta no encontrada');

    return this.prisma.tag.update({
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

  async deleteTag(id: string) {
    const existing = await this.prisma.tag.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Etiqueta no encontrada');

    return this.prisma.tag.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }
}
