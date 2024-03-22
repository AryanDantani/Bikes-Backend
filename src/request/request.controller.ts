import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  findAll() {
    return this.requestService.findAll();
  }

  @Post()
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.create(createRequestDto);
  }

  @Delete(':Id')
  Delete(@Param('Id') Id: string) {
    return this.requestService.delete(Id);
  }
}
