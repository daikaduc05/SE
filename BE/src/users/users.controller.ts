import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }
  @Post()
  async create(@Body() user: CreateUserDto) {
    return await this.usersService.create(user);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return await this.usersService.update(+id, user);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(+id);
  }
}
