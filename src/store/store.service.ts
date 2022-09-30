import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { StoreEntity } from './store.entity';

@Injectable()
export class StoreService {
   constructor(
       @InjectRepository(StoreEntity)
       private readonly storeRepository: Repository<StoreEntity>
   ){}
  
   async createStore(store: StoreEntity): Promise<StoreEntity> {
        if(store.phone.length != 10)
            throw new BusinessLogicException("The phone number must be of 10 characters", BusinessError.PRECONDITION_FAILED);
       return await this.storeRepository.save(store);
   }
}
