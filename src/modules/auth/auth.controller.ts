import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiResponse({ description: 'User created successfully' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Post('login')
  @ApiResponse({ description: 'User successfully logged in' })
  async login(@Body() dto: CreateUserDto) {
    const tokens = await this.authService.login(dto);
    return tokens;
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    const tokens = await this.authService.refresh(dto);
    return tokens;
  }
}
