import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, MinLength } from 'class-validator';
import { hash } from 'bcrypt';
import { config } from 'dotenv';

import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
  VersionColumn,
} from 'typeorm';

config();

const unixTimestamp: ValueTransformer = {
  from: (value: Date | undefined): number =>
    value ? value.getTime() : Date.now(),
  to: (value: number | undefined): Date =>
    typeof value === 'number' ? new Date(value) : value,
};

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @Column()
  login: string;

  @Exclude()
  @IsNotEmpty()
  @MinLength(8)
  @Column()
  password: string;

  @ApiProperty({ example: 1676745465172 })
  @CreateDateColumn({ transformer: unixTimestamp })
  createdAt: number;

  @ApiProperty({ example: 1676745465172 })
  @UpdateDateColumn({ transformer: unixTimestamp })
  updatedAt: number;

  @ApiProperty({ example: 1 })
  @VersionColumn()
  version: number;

  @ApiProperty({ example: 1 })
  @Column({ nullable: true })
  refreshToken: string;

  @BeforeUpdate()
  public async updateUser() {
    this.password = await hash(
      this.password,
      Number(process.env.CRYPT_SALT || 10),
    );

    this.updatedAt = Date.now();
  }

  @BeforeInsert()
  public async beforeInsert() {
    this.password = await hash(
      this.password,
      Number(process.env.CRYPT_SALT || 10),
    );
  }
}
