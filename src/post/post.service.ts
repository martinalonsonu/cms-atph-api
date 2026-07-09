import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    category: true;
    author: {
      select: {
        id: true;
        name: true;
        username: true;
      };
    };
    tags: {
      include: {
        tag: true;
      };
    };
  };
}>;

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, data: CreatePostDto) {
    const slug = data.slug ?? this.slugify(data.title);

    const post = await this.prisma.post.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        status: data.status ?? 'DRAFT',
        categoryId: data.categoryId,
        featuredImage: data.featuredImage,
        authorId: userId,
        tags: {
          create: (data.tagIds ?? []).map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, username: true } },
        tags: { include: { tag: true } },
      },
    });

    return this.formatPost(post);
  }

  async findAllPosts(query: {
    page?: number;
    limit?: number;
    categoryId?: string;
    categorySlug?: string;
    tagId?: string;
    tagSlug?: string;
    status?: string;
  }) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = {};

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.categorySlug) {
      const category = await this.prisma.category.findUnique({
        where: { slug: query.categorySlug },
        select: { id: true },
      });

      if (category) {
        where.categoryId = category.id;
      }
    }

    if (query.tagId) {
      where.tags = { some: { tagId: query.tagId } };
    }

    if (query.tagSlug) {
      const tag = await this.prisma.tag.findUnique({
        where: { slug: query.tagSlug },
        select: { id: true },
      });

      if (tag) {
        where.tags = { some: { tagId: tag.id } };
      }
    }

    if (query.status) {
      where.status = query.status as PostStatus;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          author: { select: { id: true, name: true, username: true } },
          tags: { include: { tag: true } },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      items: items.map((post) => this.formatPost(post)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOnePost(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { id: true, name: true, username: true } },
        tags: { include: { tag: true } },
      },
    });

    if (!post) throw new NotFoundException('Post no encontrado');

    return this.formatPost(post);
  }

  async updatePost(
    userId: string,
    role: string,
    postId: string,
    data: UpdatePostDto,
  ) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });

    if (!post) throw new NotFoundException('Post no encontrado');

    if (role !== 'ADMIN' && post.authorId !== userId) {
      throw new ForbiddenException(
        'Solo el autor o un administrador pueden editar este post',
      );
    }

    const slug = data.slug ?? post.slug ?? this.slugify(post.title);

    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: {
        ...(data.title ? { title: data.title } : {}),
        slug,
        ...(data.excerpt ? { excerpt: data.excerpt } : {}),
        ...(data.content ? { content: data.content } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(data.categoryId ? { categoryId: data.categoryId } : {}),
        ...(data.featuredImage ? { featuredImage: data.featuredImage } : {}),
        ...(data.tagIds
          ? {
              tags: {
                deleteMany: {},
                create: data.tagIds.map((tagId) => ({
                  tag: { connect: { id: tagId } },
                })),
              },
            }
          : {}),
      },
      include: {
        category: true,
        author: { select: { id: true, name: true, username: true } },
        tags: { include: { tag: true } },
      },
    });

    return this.formatPost(updated);
  }

  async deletePost(role: string, postId: string) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException(
        'Solo un administrador puede eliminar posts',
      );
    }

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post no encontrado');

    await this.prisma.postTag.deleteMany({ where: { postId } });
    await this.prisma.post.delete({ where: { id: postId } });

    return { deleted: true, id: postId };
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private formatPost(post: PostWithRelations) {
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      status: post.status,
      publishedAt: post.publishedAt,
      featuredImage: post.featuredImage,
      category: post.category,
      author: post.author,
      tags: post.tags.map((item) => item.tag),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
