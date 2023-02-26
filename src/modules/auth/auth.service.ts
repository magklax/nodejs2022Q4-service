import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

// import { RefreshDto } from './dto/refresh.dto';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    return user;
  }

  async login(
    dto: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    const { login, password } = dto;

    const user = await this.usersService.finByLogin(login);

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new ForbiddenException('Incorrect password');
    }

    const payload = { userId: user.id, login };

    console.log('process.env.TOKEN_EXPIRE_TIME', process.env.TOKEN_EXPIRE_TIME);

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(
      { userId: user.id, login },
      { expiresIn: process.env.TOKEN_EXPIRE_TIME },
    );

    await this.usersService.saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  // async refresh(
  //   dto: RefreshDto,
  // ): Promise<{ accessToken: string; refreshToken?: string }> {
  //   const { refreshToken } = dto;

  //   if (!refreshToken) {
  //     throw new Error('Refresh token is required');
  //   }

  //   try {
  //     const { userId, login } = this.jwtService.verify(refreshToken);
  //     const user = await this.usersService.findOne(userId);

  //     if (!user) {
  //       throw new Error('User not found');
  //     }

  //     const savedRefreshToken = user.refreshToken;

  //     if (refreshToken !== savedRefreshToken) {
  //       throw new Error('Invalid refresh token');
  //     }

  //     const accessToken = this.jwtService.sign({ userId, login });
  //     const newRefreshToken = this.jwtService.sign(
  //       { userId, login },
  //       { expiresIn: '30d' },
  //     );

  //     user.refreshToken = newRefreshToken;
  //     await this.userRepository.save(user);

  //     return {
  //       accessToken,
  //       refreshToken: newRefreshToken,
  //     };
  //   } catch (error) {
  //     throw new Error('Unable to refresh access token');
  //   }
  // }
}
