import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeEntity } from './coffe.entity';
import { CoffeService } from './coffe.service';

@Module({
  imports: [TypeOrmModule.forFeature([CoffeEntity])],
  providers: [CoffeService],
})
export class CoffeModule {}
