import { UnauthorizedException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class CustomTextValidator implements ValidatorConstraintInterface {
  validate(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    if (typeof refreshToken !== 'string') {
      throw new UnauthorizedException('Refresh must be a string');
    }
    return true;
  }
}

export class RefreshDto {
  @ApiProperty()
  @Validate(CustomTextValidator)
  refreshToken: string;
}
