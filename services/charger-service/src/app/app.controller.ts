import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateChargerDto } from './dto/create-charger.dto';
import { UpdateChargerDto } from './dto/update-charger.dto';

@Controller()
export class ChargerController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('chargers')
  createCharger(@Body() dto: CreateChargerDto) {
    return this.appService.createCharger(dto);
  }

  @Get('chargers')
  getChargers() {
    return this.appService.getChargers();
  }

  @Get('chargers/:id')
  getCharger(@Param('id') id: string) {
    return this.appService.getCharger(id);
  }

  @Put('chargers/:id')
  updateCharger(@Param('id') id: string, @Body() dto: UpdateChargerDto) {
    return this.appService.updateCharger(id, dto);
  }

  @Delete('chargers/:id')
  deleteCharger(@Param('id') id: string) {
    return this.appService.deleteCharger(id);
  }
}
