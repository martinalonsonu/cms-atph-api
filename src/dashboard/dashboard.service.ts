import { Injectable } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [posts, published, drafts, categories, tags, users, recentPosts] =
      await Promise.all([
        this.prisma.post.count(),
        this.prisma.post.count({
          where: {
            status: PostStatus.PUBLISHED,
          },
        }),
        this.prisma.post.count({
          where: {
            status: PostStatus.DRAFT,
          },
        }),
        this.prisma.category.count(),
        this.prisma.tag.count(),
        this.prisma.user.count(),
        this.prisma.post.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
          },
        }),
      ]);

    return {
      stats: {
        posts,
        published,
        drafts,
        categories,
        tags,
        users,
      },

      recentPosts,

      activity: [
        {
          type: 'post',
          message: 'Se publicó una nueva entrada',
          createdAt: new Date(),
        },
        {
          type: 'category',
          message: 'Nueva categoría creada',
          createdAt: new Date(),
        },
      ],

      postsPerMonth: [
        { month: 'Ene', total: 5 },
        { month: 'Feb', total: 8 },
        { month: 'Mar', total: 12 },
        { month: 'Abr', total: 10 },
        { month: 'May', total: 18 },
        { month: 'Jun', total: 25 },
        { month: 'Jul', total: 15 },
      ],
    };
  }
}
