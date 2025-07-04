import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LuckyNumber } from './entities/number.entity';

@Injectable()
export class NumbersService {
  constructor(
    @InjectRepository(LuckyNumber)
    private readonly repo: Repository<LuckyNumber>,
  ) { }

  async addNumber(value: number) {
    const exist = await this.repo.findOne({ where: { value } });
    console.log(exist);
    if (exist) return exist;
    const nb = this.repo.create({ value });
    await this.repo.save(nb);
    return this.repo.findOne({ where: { value } });
  }

  async listNumbers(): Promise<LuckyNumber[]> {
    return this.repo.find({ order: { createdAt: 'ASC' } });
  }

  async drawWinner(): Promise<number | null> {
    const all = await this.repo.find();
    if (all.length === 0) return null;
    const pick = all[Math.floor(Math.random() * all.length)];
    return pick.value;
  }
}
