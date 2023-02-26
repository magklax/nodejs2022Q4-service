import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { RefreshDto } from './dto/refresh.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { config } from 'dotenv';

config();
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: CreateUserDto) {
    const { login, password } = dto;

    const user = await this.usersService.finByLogin(login);

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new ForbiddenException('Incorrect password');
    }

    const payload = { userId: user.id, login };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      { userId: user.id, login },
      { expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h' },
    );

    await this.usersService.saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refresh(dto: RefreshDto) {
    const { refreshToken } = dto;

    const { userId, login } = this.jwtService.verify(refreshToken);

    const user = await this.usersService.findOne(userId);

    const savedRefreshToken = user.refreshToken;

    if (refreshToken !== savedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtService.sign({ userId, login });

    const newRefreshToken = this.jwtService.sign(
      { userId, login },
      { expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME || '24h' },
    );

    await this.usersService.saveRefreshToken(userId, newRefreshToken);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
