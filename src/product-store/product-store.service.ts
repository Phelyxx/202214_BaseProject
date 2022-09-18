import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreEntity } from '../store/store.entity';
import { ProductEntity } from '../product/product.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductStoreService {
   constructor(
       @InjectRepository(ProductEntity)
       private readonly productRepository: Repository<ProductEntity>,
   
       @InjectRepository(StoreEntity)
       private readonly storeRepository: Repository<StoreEntity>
   ) {}

   async addStoreToProduct(productId: string, storeId: string): Promise<ProductEntity> {
       const store: StoreEntity = await this.storeRepository.findOne({where: {id: storeId}});
       if (!store)
         throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND);
     
       const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["stores"]})
       if (!product)
         throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND);
   
       product.stores = [...product.stores, store];
       return await this.productRepository.save(product);
     }
   
   async findStoreFromProduct(productId: string, storeId: string): Promise<StoreEntity> {
       const store: StoreEntity = await this.storeRepository.findOne({where: {id: storeId}});
       if (!store)
         throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND)
      
       const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["stores"]});
       if (!product)
         throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
  
       const productStore: StoreEntity = product.stores.find(e => e.id === store.id);
  
       if (!productStore)
         throw new BusinessLogicException("The store with the given id is not associated to the product", BusinessError.PRECONDITION_FAILED)
  
       return productStore;
   }
   
   async findStoresFromProduct(productId: string): Promise<StoreEntity[]> {
       const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["stores"]});
       if (!product)
         throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
      
       return product.stores;
   }
   
   async updateStoresFromProduct(productId: string, stores: StoreEntity[]): Promise<ProductEntity> {
       const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["stores"]});
   
       if (!product)
         throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
   
       for (let i = 0; i < stores.length; i++) {
         const store: StoreEntity = await this.storeRepository.findOne({where: {id: stores[i].id}});
         if (!store)
           throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND)
       }
   
       product.stores = stores;
       return await this.productRepository.save(product);
     }
   
   async deleteStoreFromProduct(productId: string, storeId: string){
       const store: StoreEntity = await this.storeRepository.findOne({where: {id: storeId}});
       if (!store)
         throw new BusinessLogicException("The store with the given id was not found", BusinessError.NOT_FOUND)
   
       const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}, relations: ["stores"]});
       if (!product)
         throw new BusinessLogicException("The product with the given id was not found", BusinessError.NOT_FOUND)
   
       const productStore: StoreEntity = product.stores.find(e => e.id === store.id);
   
       if (!productStore)
           throw new BusinessLogicException("The store with the given id is not associated to the product", BusinessError.PRECONDITION_FAILED)

       product.stores = product.stores.filter(e => e.id !== storeId);
       await this.productRepository.save(product);
   }  
}