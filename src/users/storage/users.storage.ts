import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { DB } from '../../common/db.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class InMemoryUserStorage
  implements DB<UserEntity, CreateUserDto, UpdatePasswordDto>
{
  private users: UserEntity[] = [];

  create(dto: CreateUserDto) {
    const createdAt = Date.now();

    const user = {
      ...dto,
      id: uuidv4(),
      version: 1,
      createdAt,
      updatedAt: createdAt,
    };

    this.users.push(user);

    return user;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    return this.users.find((user) => user.id === id);
  }

  update(id: string, dto: UpdatePasswordDto) {
    const index = this.users.findIndex((user) => user.id === id);

    const user = {
      ...this.users[index],
      password: dto.newPassword,
      version: this.users[index].version + 1,
      updatedAt: Date.now(),
    };

    this.users[index] = user;

    return user;
  }

  remove(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
