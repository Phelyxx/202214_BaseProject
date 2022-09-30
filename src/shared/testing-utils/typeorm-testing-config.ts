import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeEntity } from '../../coffe/coffe.entity';
import { StoreEntity } from '../../store/store.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [CoffeEntity, StoreEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([CoffeEntity, StoreEntity]),
];