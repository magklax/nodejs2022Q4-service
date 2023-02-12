import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from '../typorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const createdAt = Date.now();

    const user = this.userRepository.create({
      ...dto,
      createdAt,
      updatedAt: createdAt,
    });

    await this.userRepository.save(user);

    return user;
  }

  async findAll() {
    const users = await this.userRepository.find();

    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException(`User with ID "${id}" not found`);
    });

    return user;
  }

  async update(id: string, dto: UpdatePasswordDto) {
    const user = await this.userRepository.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException(`User with ID "${id}" not found`);
    });

    if (dto.oldPassword !== user.password) {
      throw new ForbiddenException('Password does not match');
    }

    const updatedUser = new UserEntity({
      ...user,
      password: dto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });

    await this.userRepository.update(id, updatedUser);

    return updatedUser;
  }

  async remove(id: string) {
    await this.userRepository.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException(`User with ID "${id}" not found`);
    });

    this.userRepository.delete(id);
  }
}
