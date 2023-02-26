import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'dotenv';

import { UserEntity } from '../../typeorm';
import { UsersService } from '../../modules/users/users.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

config();

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService],
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME || '1h' },
    }),
  ],
  exports: [JwtModule, TypeOrmModule.forFeature([UserEntity])],
})
export class AuthModule {}
