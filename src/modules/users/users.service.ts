import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from '../../typeorm';
import { compare } from 'bcrypt';

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

  async finByLogin(login: string) {
    const user = await this.userRepository
      .findOneByOrFail({ login })
      .catch(() => {
        throw new ForbiddenException('Incorrect login');
      });

    return user;
  }

  async update(id: string, dto: UpdatePasswordDto) {
    const user = await this.userRepository.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException(`User with ID "${id}" not found`);
    });

    const passwordMatch = await compare(dto.oldPassword, user.password);

    if (!passwordMatch) {
      throw new ForbiddenException('Incorrect password');
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

  async saveRefreshToken(id: string, refreshToken: string): Promise<void> {
    const user = await this.userRepository.findOneByOrFail({ id }).catch(() => {
      throw new NotFoundException(`User with ID "${id}" not found`);
    });

    user.refreshToken = refreshToken;

    await this.userRepository.save(user);
  }
}
