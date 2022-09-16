import { Module } from '@nestjs/common';
import { ProductoTiendaService } from './producto-tienda.service';

@Module({
  providers: [ProductoTiendaService]
})
export class ProductoTiendaModule {}
