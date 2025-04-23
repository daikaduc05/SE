import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/sign-up.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/login.dto';
import { AuthenticateGuard } from 'src/users/authenticate/authenticate.guard';
import { CustomRequest } from 'src/custom-interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
@Controller('users')
export class UsersController {
  private readonly logger: Logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  async findAll() {
    this.logger.log('[Start Controller] findAll');
    return await this.usersService.findAll();
  }

  @Post('/')
  async signUp(@Body() user: UserSignUpDto) {
    this.logger.log('[Start Controller] signUp');
    return await this.usersService.create(user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Delete('/')
  async delete(@Request() req: CustomRequest) {
    this.logger.log('[Start Controller] delete user');
    return await this.usersService.deleteSelf(req.userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Put('/')
  async update(@Body() user: UserUpdateDto, @Request() req: CustomRequest) {
    this.logger.log('[Start Controller] update user profile');
    return await this.usersService.update(req.userId, user);
  }

  @Post('/login')
  async login(@Body() user: UserLoginDto) {
    this.logger.log('[Start Controller] login');
    return await this.usersService.login(user);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Put('/password')
  async changePassword(@Body() body: ChangePasswordDto, @Request() req: CustomRequest) {
    this.logger.log('[Start Controller] change password');
    return await this.usersService.changePassword(req.userId, body);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Get('/notifications')
  async getNotifications(@Request() req: CustomRequest) {
    this.logger.log('[Start Controller] get notifications');
    return await this.usersService.getNotifications(req.userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Put('/notifications/:id')
  async readNotification(@Param('id') id: number, @Request() req: CustomRequest) {
    this.logger.log('[Start Controller] read notification');
    this.logger.log(req.userId);
    return await this.usersService.readNotification(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Delete('/notifications/')
  async deleteAllNotifications(@Request() req: CustomRequest) {
    this.logger.log('[Start Controller] delete all notifications');
    return await this.usersService.deleteAllNotifications(req.userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Delete('/notifications/:id')
  async deleteNotification(@Param('id') id: number, @Request() req: CustomRequest) {
    this.logger.log('[Start Controller] delete notification');
    this.logger.log(req.userId);
    return await this.usersService.deleteNotification(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(AuthenticateGuard)
  @Get('/:id')
  async find(@Param('id') id: string) {
    this.logger.log('[Start Controller] find profile by id');
    return await this.usersService.findOne(+id);
  }
}
