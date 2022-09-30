import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeEntity } from '../coffe/coffe.entity';
import { StoreEntity } from '../store/store.entity';
import { StoreCoffeService } from './store-coffe.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity, CoffeEntity])],
  providers: [StoreCoffeService]
})
export class StoreCoffeModule {}
