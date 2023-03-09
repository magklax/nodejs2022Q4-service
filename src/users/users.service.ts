import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InMemoryUserStorage } from './storage/users.storage';

@Injectable()
export class UsersService {
  constructor(private storage: InMemoryUserStorage) {}

  create(dto: CreateUserDto) {
    return this.storage.create(dto);
  }

  findAll() {
    return this.storage.findAll();
  }

  findOne(id: string) {
    return this.storage.findOne(id);
  }

  update(id: string, dto: UpdatePasswordDto) {
    return this.storage.update(id, dto);
  }

  remove(id: string) {
    this.storage.remove(id);
  }
}
