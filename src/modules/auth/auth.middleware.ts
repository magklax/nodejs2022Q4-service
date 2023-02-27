import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { UserEntity } from 'src/typeorm';
import { config } from 'dotenv';

config();

interface AuthenticatedRequest extends Request {
  user: UserEntity;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
    const excludedPaths = ['/auth/signup', '/auth/login', '/doc', '/'];

    if (excludedPaths.includes(req.path)) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findOne(decoded.id);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      req.user = user;

      next();
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
