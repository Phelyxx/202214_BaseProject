import { Module } from '@nestjs/common';
import { ProductStoreService } from './product-store.service';
import { ProductStoreController } from './product-store.controller';
import { ProductEntity } from '../product/product.entity';
import { StoreEntity } from '../store/store.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, StoreEntity])],
  providers: [ProductStoreService],
  controllers: [ProductStoreController]
})
export class ProductStoreModule {}
