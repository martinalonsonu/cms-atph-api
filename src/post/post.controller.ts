import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoryId') categoryId?: string,
    @Query('categorySlug') categorySlug?: string,
    @Query('tagId') tagId?: string,
    @Query('tagSlug') tagSlug?: string,
    @Query('status') status?: string,
  ) {
    return this.postService.findAllPosts({
      page: Number(page),
      limit: Number(limit),
      categoryId,
      categorySlug,
      tagId,
      tagSlug,
      status,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOnePost(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'WRITER')
  @Post()
  create(
    @Req() req: Request & { user?: { id?: string } },
    @Body() dto: CreatePostDto,
  ) {
    return this.postService.createPost(req.user?.id ?? '', dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'WRITER')
  @Patch(':id')
  update(
    @Req() req: Request & { user?: { id?: string; role?: string } },
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postService.updatePost(
      req.user?.id ?? '',
      req.user?.role ?? 'WRITER',
      id,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postService.deletePost('ADMIN', id);
  }
}
