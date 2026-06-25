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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/edit-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll(@Query('email') email?: string) {
    if (email) return this.usersService.findByEmail(email);
    return this.usersService.findAll();
  }

  @Patch()
  updateUser(@Query('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
