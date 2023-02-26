import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
// import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ description: 'User created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  async login(@Body() dto: CreateUserDto) {
    const tokens = await this.authService.login(dto);
    return tokens;
  }

  // @Post('refresh')
  // async refresh(@Body() dto: RefreshDto) {
  //   const tokens = await this.authService.refresh(dto);
  //   return tokens;
  // }
}
