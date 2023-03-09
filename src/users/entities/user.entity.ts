import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  login: string;

  @Exclude()
  password: string;

  @ApiProperty({ example: 1 })
  version: number;

  @ApiProperty({ example: 1655000000 })
  createdAt: number;

  @ApiProperty({ example: 1655000000 })
  updatedAt: number;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
