import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductoModule } from './producto/producto.module';
import { TiendaModule } from './tienda/tienda.module';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';

@Module({
  imports: [ProductoModule, TiendaModule, ProductoTiendaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
