import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'John Doe' })
  @Column()
  login: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ example: 1 })
  @Column({ default: 1 })
  version: number;

  @ApiProperty({ example: 1655000000 })
  @Column({ type: 'bigint' })
  createdAt: number;

  @ApiProperty({ example: 1655000000 })
  @Column({ type: 'bigint' })
  updatedAt: number;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
