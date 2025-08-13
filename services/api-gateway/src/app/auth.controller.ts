import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '../app/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(@Body() createUserDto: { name: string }) {
    try {
      return await this.authService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException('Failed to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('users')
  async getUsers() {
    try {
      return await this.authService.getUsers();
    } catch (error) {
      throw new HttpException('Failed to fetch users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    try {
      return await this.authService.getUser(+id);
    } catch (error) {
      throw new HttpException('Failed to fetch user', HttpStatus.NOT_FOUND);
    }
  }

  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: { name: string }
  ) {
    try {
      return await this.authService.updateUser(+id, updateUserDto);
    } catch (error) {
      throw new HttpException('Failed to update user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.authService.deleteUser(+id);
    } catch (error) {
      throw new HttpException('Failed to delete user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
