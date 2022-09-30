import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';

const types = ["Perishable", "Non perishable"];

@Injectable()
export class ProductService {
   constructor(
       @InjectRepository(ProductEntity)
       private readonly productRepository: Repository<ProductEntity>
   ){}

   async findAll(): Promise<ProductEntity[]> {
       return await this.productRepository.find({ relations: ["stores"] });
   }

   async findOne(id: string): Promise<ProductEntity> {
       const product: ProductEntity = await this.productRepository.findOne({where: {id}, relations: ["stores"] } );
       if (!product)
         throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
  
       return product;
   }
  
   async create(product: ProductEntity): Promise<ProductEntity> {
       if(!types.includes(product.type))
            throw new BusinessLogicException("The type is not valid", BusinessError.BAD_REQUEST);
       return await this.productRepository.save(product);
   }

   async update(id: string, product: ProductEntity): Promise<ProductEntity> {
       const persistedProduct: ProductEntity = await this.productRepository.findOne({where:{id}});
       if (!persistedProduct)
         throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
       if(!types.includes(persistedProduct.type))
         throw new BusinessLogicException("The type is not valid", BusinessError.BAD_REQUEST);   
       product.id = id; 
      
       return await this.productRepository.save(product);
   }

   async delete(id: string) {
       const product: ProductEntity = await this.productRepository.findOne({where:{id}});
       if (!product)
         throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
    
       await this.productRepository.remove(product);
   }
}
