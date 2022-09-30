import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoffeEntity } from '../coffe/coffe.entity';
import { StoreEntity } from '../store/store.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class StoreCoffeService {
   constructor(
       @InjectRepository(StoreEntity)
       private readonly storeRepository: Repository<StoreEntity>,
   
       @InjectRepository(CoffeEntity)
       private readonly coffeRepository: Repository<CoffeEntity>
   ) {}

   async addCoffeToStore(storeId: string, coffeId: string): Promise<StoreEntity> {
       const coffe: CoffeEntity = await this.coffeRepository.findOne({where: {id: coffeId}});
       if (!coffe)
         throw new BusinessLogicException("The coffe with the given id was not found", BusinessError.NOT_FOUND);
     
       const store: StoreEntity = await this.storeRepository.findOne({where: {id: storeId}, relations: ["coffes"]})
       if (!store)
         throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND);
   
       store.coffes = [...store.coffes, coffe];
       return await this.storeRepository.save(store);
     }
   
}