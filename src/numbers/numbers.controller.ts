import { Controller, Get, Post, Body } from '@nestjs/common';
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
}
