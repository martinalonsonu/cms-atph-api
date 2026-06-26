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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tag')
export class TagController {
  constructor(private tagService: TagService) {}

  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagService.createTag(dto);
  }

  @Get()
  findAll() {
    return this.tagService.findAllTags();
  }

  @Patch()
  updateUser(@Query('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagService.updateTag(id, dto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.tagService.deleteTag(id);
  }
}
