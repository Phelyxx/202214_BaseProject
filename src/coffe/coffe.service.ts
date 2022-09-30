import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CoffeEntity } from './coffe.entity';

@Injectable()
export class CoffeService {
   constructor(
       @InjectRepository(CoffeEntity)
       private readonly coffeRepository: Repository<CoffeEntity>
   ){}
  
   async createCoffe(coffe: CoffeEntity): Promise<CoffeEntity> {
       if(coffe.price < 0)
            throw new BusinessLogicException("The coffe price has to be positive", BusinessError.PRECONDITION_FAILED);
       return await this.coffeRepository.save(coffe);
   }

}
