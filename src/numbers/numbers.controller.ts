import { Controller, Get, Post, Body, Param, BadRequestException } from '@nestjs/common';
import { NumbersService } from './numbers.service';

@Controller('numbers')
export class NumbersController {
  constructor(private readonly svc: NumbersService) { }

  @Post()
  create(@Body('value') value: number) {
    return this.svc.addNumber(value);
  }

  @Get()
  findAll() {
    return this.svc.listNumbers();
  }

  @Get('draw')
  draw() {
    return this.svc.drawWinner().then(w =>
      w !== null
        ? { winner: w }
        : { message: 'No hay números para sortear' },
    );
  }
  @Get('validate/:value')
  validate(@Param('value') value: string) {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      throw new BadRequestException('Parámetro inválido');
    }
    return this.svc.exists(num).then(exists => ({ value: num, exists }));
  }

  @Get('next')
  async next() {
    return await this.svc.createNext();

  }
}
