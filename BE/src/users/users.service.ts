import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository, DeleteResult } from 'typeorm';
import { User } from './entities/users.entity';
import { UserSignUpDto } from './dto/sign-up.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import 'reflect-metadata';
import { Role } from './entities/role.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { NotificationUser } from './entities/notification-user.entity';
import { Notification } from './entities/notification.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { TypeNotiEnum } from 'src/enum/typeNoti.enum';
config();
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private roleRepository: Repository<Role>,
    @Inject('NOTIFICATION_USER_REPOSITORY')
    private notificationUserRepository: Repository<NotificationUser>,
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepository: Repository<Notification>,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<User[] | null> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmails(email: string[]): Promise<User[] | null> {
    const userUnique = await this.userRepository.find({ where: { email: In(email) } });
    const mapUser = new Map(userUnique.map((item) => [item.email, item]));
    const users = email.map((item) => {
      const matchUser = mapUser.get(item);
      if (!matchUser) {
        throw new NotFoundException('User not found');
      }
      return matchUser;
    });
    return users;
  }

  generateToken(user: User): string {
    const payload = { id: user.id, email: user.email };
    const key = process.env.JWT_SECRET;
    const token = jwt.sign(payload, key as string, { expiresIn: '1h' });

    return token;
  }

  async login(user: UserLoginDto): Promise<string | null> {
    const dtoUser = await this.userRepository.findOne({ where: { email: user.email } });
    if (!dtoUser) {
      throw new UnauthorizedException('Email/password does match');
    }
    const isMatch = await bcrypt.compare(user.password, dtoUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email/password does match');
    }
    return this.generateToken(dtoUser);
  }

  async create(user: UserSignUpDto): Promise<User | null> {
    const newUser = new User();
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.notiSettings = true;
    newUser.isBanned = false;
    const saltRounds = 10;
    const password: string = user.password;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    newUser.password = hashedPassword;
    return await this.userRepository.save(newUser);
  }

  async update(id: number, user: UserUpdateDto): Promise<User | null> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    Object.assign(existingUser, user);
    return await this.userRepository.save(existingUser);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findRole(rolename: string[]): Promise<Role[] | null> {
    const roleUnique = await this.roleRepository.find({ where: { name: In(rolename) } });
    const mapRole = new Map(roleUnique.map((item) => [item.name, item]));
    const roles = rolename.map((item) => {
      const matchRole = mapRole.get(item);
      if (!matchRole) {
        throw new NotFoundException('Role not found');
      }
      return matchRole;
    });
    return roles;
  }

  async deleteSelf(userId: number): Promise<DeleteResult> {
    return await this.userRepository.delete(userId);
  }

  async changePassword(userId: number, body: ChangePasswordDto): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { oldPassword, newPassword } = body;
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Old password does not match');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    return await this.userRepository.save(user);
  }

  async getNotifications(userId: number): Promise<NotificationUser[] | null> {
    return await this.notificationUserRepository.find({
      where: { user: { id: userId } },
      relations: ['notification'],
    });
  }

  async sendNotification(
    userId: number,
    message: string,
    type: TypeNotiEnum,
    projectId: number,
    taskId: number,
  ): Promise<void> {
    const notification = new Notification();
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`User not found for userId ${userId}`);
      return;
    }
    notification.content = message;
    notification.createdAt = new Date();
    notification.type = type;
    notification.projectId = projectId;
    notification.taskId = taskId;
    const notificationUser = new NotificationUser();
    notificationUser.notification = notification;
    notificationUser.user = user;
    notificationUser.isRead = false;

    await this.notificationRepository.save(notification);
    await this.notificationUserRepository.save(notificationUser);
    this.eventEmitter.emit('triggerNoti', {
      userId: userId,
      message: message,
      type: type,
      projectId: projectId,
      taskId: taskId,
    });
  }

  async readNotification(notificationId: number): Promise<void> {
    await this.notificationUserRepository.update({ id: notificationId }, { isRead: true });
  }

  async deleteNotification(notificationId: number): Promise<void> {
    await this.notificationUserRepository.delete(notificationId);
  }

  async deleteAllNotifications(userId: number): Promise<void> {
    await this.notificationUserRepository.delete({ user: { id: userId } });
  }
}
