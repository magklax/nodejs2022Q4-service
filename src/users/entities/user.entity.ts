import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ValueTransformer,
  VersionColumn,
} from 'typeorm';

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
  @Column()
  login: string;

  @Exclude()
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

  @BeforeUpdate()
  public updateUser() {
    this.updatedAt = Date.now();
  }
}
