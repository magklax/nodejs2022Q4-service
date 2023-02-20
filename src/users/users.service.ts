import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from '../typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = this.userRepository.create(dto);

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

    const userToUpdate = Object.assign(user, {
      ...user,
      password: dto.newPassword,
    });

    const updatedUser = await this.userRepository.save(userToUpdate);

    return updatedUser;
  }

  async remove(id: string) {
    await this.userRepository.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException(`User with ID "${id}" not found`);
    });

    this.userRepository.delete(id);
  }
}
