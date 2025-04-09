import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import 'reflect-metadata';

config();
@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  generateToken(user: User): string {
    const payload = { id: user.id, email: user.email };
    const key = process.env.JWT_SECRET;
    const token = jwt.sign(payload, key as string, { expiresIn: '1h' });

    return token;
  }

  async login(user: LoginDto): Promise<string | null> {
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
  async create(user: SignUpDto): Promise<User | null> {
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

  async update(id: number, user: UpdateUserDto): Promise<User | null> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    existingUser.name = user.name;
    existingUser.email = user.email;
    return await this.userRepository.save(existingUser);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
