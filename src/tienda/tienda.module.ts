import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';
import { TiendaService } from './tienda.service';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
  providers: [TiendaService],
})
export class TiendaModule {}
