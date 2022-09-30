import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreEntity } from './store.entity';
import { StoreService } from './store.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoreEntity])],
  providers: [StoreService],
})
export class StoreModule {}
