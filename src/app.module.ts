import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeModule } from './coffe/coffe.module';
import { StoreModule } from './store/store.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeEntity } from './coffe/coffe.entity';
import { StoreEntity } from './store/store.entity';
import { StoreCoffeModule } from './store-coffe/store-coffe.module';

@Module({
  imports: [CoffeModule, StoreModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'coffestores',
      entities: [CoffeEntity, StoreEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    StoreCoffeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
