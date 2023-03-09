import { Module } from '@nestjs/common';

import { InMemoryUserStorage } from './storage/users.storage';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, InMemoryUserStorage],
})
export class UsersModule {}
