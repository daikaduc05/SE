import { Controller, Get, Param, Post, Body, Put, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthenticateGuard } from 'src/authenticate/authenticate.guard';
import { CustomRequest } from 'src/custom-interface';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Post('/signup')
  async signUp(@Body() user: SignUpDto) {
    return await this.usersService.create(user);
  }

  @Post('/login')
  async login(@Body() user: LoginDto) {
    return await this.usersService.login(user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Put('')
  async update(@Body() user: UpdateUserDto, @Request() req: CustomRequest) {
    return await this.usersService.update(req.userId, user);
  }
}
