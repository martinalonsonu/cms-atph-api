import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'WRITER')
  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagService.createTag(dto);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.tagService.findAllTags({
      page: Number(page),
      limit: Number(limit),
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'WRITER')
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagService.updateTag(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.tagService.deleteTag(id);
  }
}
