import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async create(user: CreateUserDto): Promise<User | null> {
    const newUser = new User();
    newUser.name = user.name;
    newUser.email = user.email;
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
