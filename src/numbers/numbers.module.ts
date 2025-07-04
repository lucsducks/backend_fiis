import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NumbersService } from './numbers.service';
import { NumbersController } from './numbers.controller';
import { LuckyNumber } from './entities/number.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LuckyNumber])],
  providers: [NumbersService],
  controllers: [NumbersController],
})
export class NumbersModule { }
