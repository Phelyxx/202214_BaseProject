import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { StoreEntity } from './store.entity';
import { StoreService } from './store.service';

import { faker } from '@faker-js/faker';

describe('StoreService', () => {
  let service: StoreService;
  let repository: Repository<StoreEntity>;
  let storesList: StoreEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [StoreService],
    }).compile();

    service = module.get<StoreService>(StoreService);
    repository = module.get<Repository<StoreEntity>>(getRepositoryToken(StoreEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    storesList = [];
    for(let i = 0; i < 5; i++){
        const store: StoreEntity = await repository.save({
        name: faker.company.name(), 
        address: faker.address.streetAddress(),
        phone: faker.datatype.string(10),

      })
        storesList.push(store);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new store', async () => {
    const store: StoreEntity = {
      id: "",
      name: faker.company.name(), 
      address: faker.address.streetAddress(),
      phone: faker.datatype.string(10),
      coffes: [],
    }

    const newStore: StoreEntity = await service.createStore(store);
    expect(newStore).not.toBeNull();

    const storedStore: StoreEntity = await repository.findOne({where: {id: newStore.id}})
    expect(storedStore).not.toBeNull();
    expect(storedStore.name).toEqual(newStore.name)
    expect(storedStore.address).toEqual(newStore.address)
    expect(storedStore.phone).toEqual(newStore.phone)
  });

 
  it('create should throw an exception for an invalid store', async () => {
    let store: StoreEntity = storesList[0];
    store = {
      ...store, phone: "1"
    }
    await expect(() => service.createStore(store)).rejects.toHaveProperty("message", "The phone number must be of 10 characters")
  });
});