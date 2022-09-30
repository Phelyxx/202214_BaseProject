import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CoffeEntity } from './coffe.entity';
import { CoffeService } from './coffe.service';

import { faker } from '@faker-js/faker';

describe('CoffeService', () => {
  let service: CoffeService;
  let repository: Repository<CoffeEntity>;
  let coffesList: CoffeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CoffeService],
    }).compile();

    service = module.get<CoffeService>(CoffeService);
    repository = module.get<Repository<CoffeEntity>>(getRepositoryToken(CoffeEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    coffesList = [];
    for(let i = 0; i < 5; i++){
        const coffe: CoffeEntity = await repository.save({
          name: faker.company.name(), 
          description: faker.lorem.sentence(),
          price: faker.datatype.number(),
      })
        coffesList.push(coffe);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new coffe', async () => {
    const coffe: CoffeEntity = {
      id: "",
      name: faker.company.name(), 
      description: faker.lorem.sentence(),
      price: faker.datatype.number(),
      stores: [],
    }

    const newCoffe: CoffeEntity = await service.createCoffe(coffe);
    expect(newCoffe).not.toBeNull();

    const storedCoffe: CoffeEntity = await repository.findOne({where: {id: newCoffe.id}})
    expect(storedCoffe).not.toBeNull();
    expect(storedCoffe.name).toEqual(newCoffe.name)
    expect(storedCoffe.description).toEqual(newCoffe.description)
    expect(storedCoffe.price).toEqual(newCoffe.price)
  });


  it('create should throw an exception for an invalid coffe', async () => {
    let coffe: CoffeEntity = coffesList[0];
    coffe = {
      ...coffe, price: -10
    }
    await expect(() => service.createCoffe(coffe)).rejects.toHaveProperty("message", "The coffe price has to be positive")
  });
 
});