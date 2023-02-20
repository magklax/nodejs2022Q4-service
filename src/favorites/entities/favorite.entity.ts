import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'favorites' })
export class FavoriteEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text', { array: true, unique: true })
  albumsIds: string[];

  @ApiProperty()
  @Column('text', { array: true, unique: true })
  artistsId: string[];

  @ApiProperty()
  @Column('text', { array: true, unique: true })
  tracksIds: string[];
}
