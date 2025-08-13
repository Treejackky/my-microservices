import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ChargersService } from './chargers.service';

@Controller('chargers')
export class ChargersController {
  constructor(private readonly chargersService: ChargersService) {}

  @Post()
  async createCharger(@Body() dto: { id: string; status: string }) {
    try {
      return await this.chargersService.createCharger(dto);
    } catch (error) {
      throw new HttpException('Failed to create charger', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.chargersService.getChargers();
    } catch (error) {
      throw new HttpException('Failed to fetch chargers', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.chargersService.getCharger(id);
    } catch (error) {
      throw new HttpException('Failed to fetch charger', HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async updateCharger(@Param('id') id: string, @Body() dto: { status?: string }) {
    try {
      return await this.chargersService.updateCharger(id, dto);
    } catch (error) {
      throw new HttpException('Failed to update charger', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async deleteCharger(@Param('id') id: string) {
    try {
      return await this.chargersService.deleteCharger(id);
    } catch (error) {
      throw new HttpException('Failed to delete charger', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
