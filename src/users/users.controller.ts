import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    const user = this.usersService.create(createUserDto);
    return new UserEntity(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll() {
    const users = this.usersService
      .findAll()
      .map((user) => new UserEntity(user));
    return users;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const user = this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return new UserEntity(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @UsePipes(ValidationPipe)
  update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    if (updatePasswordDto.oldPassword !== user.password) {
      throw new ForbiddenException('Password does not match');
    }

    const updatedUser = this.usersService.update(id, updatePasswordDto);

    return new UserEntity(updatedUser);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ description: 'The user has been deleted' })
  @HttpCode(204)
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: string,
  ) {
    const user = this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return this.usersService.remove(id);
  }
}
