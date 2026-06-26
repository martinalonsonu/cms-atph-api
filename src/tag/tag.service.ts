import { Injectable } from '@nestjs/common';
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
      },
    });
  }

  async findAllTags() {
    return this.prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }

  async updateTag(id: string, value: UpdateTagDto) {
    return this.prisma.tag.update({
      where: { id },
      data: value,
      select: {
        name: true,
        slug: true,
      },
    });
  }

  async deleteTag(id: string) {
    return this.prisma.tag.delete({
      where: { id },
      select: {
        name: true,
        slug: true,
      },
    });
  }
}
