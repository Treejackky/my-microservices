import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('users')
  createUser(@Body() dto: CreateUserDto) {
    return this.appService.createUser(dto.name);
  }

  @Get('users')
  getUsers() {
    return this.appService.getUsers();
  }

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.appService.getUser(+id);
  }

  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.appService.updateUser(+id, dto.name);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.appService.deleteUser(+id);
  }
}
