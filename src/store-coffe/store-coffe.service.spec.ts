import { Test, TestingModule } from '@nestjs/testing';
import { CoffeEntity } from '../coffe/coffe.entity';
import { Repository } from 'typeorm';
import { StoreEntity } from '../store/store.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { StoreCoffeService } from './store-coffe.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('StoreCoffeService', () => {
  let service: StoreCoffeService;
  let storeRepository: Repository<StoreEntity>;
  let coffeRepository: Repository<CoffeEntity>;
  let store: StoreEntity;
  let coffesList : CoffeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreCoffeService],
    }).compile();

    service = module.get<StoreCoffeService>(StoreCoffeService);
    storeRepository = module.get<Repository<StoreEntity>>(getRepositoryToken(StoreEntity));
    coffeRepository = module.get<Repository<CoffeEntity>>(getRepositoryToken(CoffeEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    coffeRepository.clear();
    storeRepository.clear();

    coffesList = [];
    for(let i = 0; i < 5; i++){
        const coffe: CoffeEntity = await coffeRepository.save({
          name: faker.company.name(), 
          description: faker.lorem.sentence(),
          price: faker.datatype.number(),
        })
        coffesList.push(coffe);
    }

    store = await storeRepository.save({
      name: faker.company.name(), 
      address: faker.address.streetAddress(),
      phone: faker.datatype.string(10),
      coffes: coffesList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCoffeStore should add an coffe to a store', async () => {
    const newCoffe: CoffeEntity = await coffeRepository.save({
      name: faker.company.name(), 
      description: faker.lorem.sentence(),
      price: faker.datatype.number(),
    });

    const newStore: StoreEntity = await storeRepository.save({
      name: faker.company.name(), 
      address: faker.address.streetAddress(),
      phone: faker.datatype.string(10),
    })

    const result: StoreEntity = await service.addCoffeToStore(newStore.id, newCoffe.id);
    
    expect(result.coffes.length).toBe(1);
    expect(result.coffes[0]).not.toBeNull();
    expect(result.coffes[0].name).toBe(newCoffe.name)
    expect(result.coffes[0].description).toBe(newCoffe.description)
    expect(result.coffes[0].price).toBe(newCoffe.price)
  });

  it('addCoffeStore should thrown exception for an invalid coffe', async () => {
    const newStore: StoreEntity = await storeRepository.save({
      name: faker.company.name(), 
      address: faker.address.streetAddress(),
      phone: faker.datatype.string(10),
    })

    await expect(() => service.addCoffeToStore(newStore.id, "0")).rejects.toHaveProperty("message", "The coffe with the given id was not found");
  });

  it('addCoffeStore should throw an exception for an invalid store', async () => {
    const newCoffe: CoffeEntity = await coffeRepository.save({
      name: faker.company.name(), 
      description: faker.lorem.sentence(),
      price: faker.datatype.number(),
    });

    await expect(() => service.addCoffeToStore("0", newCoffe.id)).rejects.toHaveProperty("message", "The store with the given id was not found");
  });

});