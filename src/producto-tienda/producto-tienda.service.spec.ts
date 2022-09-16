import { Test, TestingModule } from '@nestjs/testing';
import { TiendaEntity } from '../tienda/tienda.entity';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoTiendaService } from './producto-tienda.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let producto: ProductoEntity;
  let tiendasList : TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();

    tiendasList = [];
    for(let i = 0; i < 5; i++){
        const tienda: TiendaEntity = await tiendaRepository.save({
          nombre: faker.company.name(), 
          ciudad: faker.datatype.string(3),
          direccion: faker.address.streetAddress(),
        })
        tiendasList.push(tienda);
    }

    producto = await productoRepository.save({
      nombre: faker.company.name(), 
      tipo: faker.helpers.arrayElement(["Perecedero", "No perecedero"]),
      precio: faker.datatype.number(),
      tiendas: tiendasList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addTiendaProducto should add an tienda to a producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.datatype.string(3),
      direccion: faker.address.streetAddress(),
    });

    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(), 
      tipo: faker.helpers.arrayElement(["Perecedero", "No perecedero"]),
      precio: faker.datatype.number(),
    })

    const result: ProductoEntity = await service.addTiendaProducto(newProducto.id, newTienda.id);
    
    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(result.tiendas[0].ciudad).toBe(newTienda.ciudad);
    expect(result.tiendas[0].direccion).toBe(newTienda.direccion);
  });

  it('addTiendaProducto should thrown exception for an invalid tienda', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.company.name(), 
      tipo: faker.helpers.arrayElement(["Perecedero", "No perecedero"]),
      precio: faker.datatype.number(),
    })

    await expect(() => service.addTiendaProducto(newProducto.id, "0")).rejects.toHaveProperty("message", "The tienda with the given id was not found");
  });

  it('addTiendaProducto should throw an exception for an invalid producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.datatype.string(3),
      direccion: faker.address.streetAddress(),
    });

    await expect(() => service.addTiendaProducto("0", newTienda.id)).rejects.toHaveProperty("message", "The producto with the given id was not found");
  });

  it('findTiendaByProductoIdTiendaId should return tienda by producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    const storedTienda: TiendaEntity = await service.findTiendaByProductoIdTiendaId(producto.id, tienda.id, )
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toBe(tienda.nombre);
    expect(storedTienda.ciudad).toBe(tienda.ciudad);
    expect(storedTienda.direccion).toBe(tienda.direccion);
  });

  it('findTiendaByProductoIdTiendaId should throw an exception for an invalid tienda', async () => {
    await expect(()=> service.findTiendaByProductoIdTiendaId(producto.id, "0")).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('findTiendaByProductoIdTiendaId should throw an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = tiendasList[0]; 
    await expect(()=> service.findTiendaByProductoIdTiendaId("0", tienda.id)).rejects.toHaveProperty("message", "The producto with the given id was not found"); 
  });

  it('findTiendaByProductoIdTiendaId should throw an exception for an tienda not associated to the producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.datatype.string(3),
      direccion: faker.address.streetAddress(),
    });

    await expect(()=> service.findTiendaByProductoIdTiendaId(producto.id, newTienda.id)).rejects.toHaveProperty("message", "The tienda with the given id is not associated to the producto"); 
  });

  it('findTiendasByProductoId should return tiendas by producto', async ()=>{
    const tiendas: TiendaEntity[] = await service.findTiendasByProductoId(producto.id);
    expect(tiendas.length).toBe(5)
  });

  it('findTiendasByProductoId should throw an exception for an invalid producto', async () => {
    await expect(()=> service.findTiendasByProductoId("0")).rejects.toHaveProperty("message", "The producto with the given id was not found"); 
  });

  it('associateTiendasProducto should update tiendas list for a producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.datatype.string(3),
      direccion: faker.address.streetAddress(),
    });

    const updatedProducto: ProductoEntity = await service.associateTiendasProducto(producto.id, [newTienda]);
    expect(updatedProducto.tiendas.length).toBe(1);

    expect(updatedProducto.tiendas[0].nombre).toBe(newTienda.nombre);
    expect(updatedProducto.tiendas[0].ciudad).toBe(newTienda.ciudad);
    expect(updatedProducto.tiendas[0].direccion).toBe(newTienda.direccion);
  });

  it('associateTiendasProducto should throw an exception for an invalid producto', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.datatype.string(3),
      direccion: faker.address.streetAddress(),
    });

    await expect(()=> service.associateTiendasProducto("0", [newTienda])).rejects.toHaveProperty("message", "The producto with the given id was not found"); 
  });

  it('associateTiendasProducto should throw an exception for an invalid tienda', async () => {
    const newTienda: TiendaEntity = tiendasList[0];
    newTienda.id = "0";

    await expect(()=> service.associateTiendasProducto(producto.id, [newTienda])).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('deleteTiendaToProducto should remove an tienda from a producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    
    await service.deleteTiendaProducto(producto.id, tienda.id);

    const storedProducto: ProductoEntity = await productoRepository.findOne({where: {id: producto.id}, relations: ["tiendas"]});
    const deletedTienda: TiendaEntity = storedProducto.tiendas.find(a => a.id === tienda.id);

    expect(deletedTienda).toBeUndefined();

  });

  it('deleteTiendaToProducto should thrown an exception for an invalid tienda', async () => {
    await expect(()=> service.deleteTiendaProducto(producto.id, "0")).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('deleteTiendaToProducto should thrown an exception for an invalid producto', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(()=> service.deleteTiendaProducto("0", tienda.id)).rejects.toHaveProperty("message", "The producto with the given id was not found"); 
  });

  it('deleteTiendaToProducto should thrown an exception for an non asocciated tienda', async () => {
    const newTienda: TiendaEntity = await tiendaRepository.save({
      nombre: faker.company.name(), 
      ciudad: faker.datatype.string(3),
      direccion: faker.address.streetAddress(),
    });

    await expect(()=> service.deleteTiendaProducto(producto.id, newTienda.id)).rejects.toHaveProperty("message", "The tienda with the given id is not associated to the producto"); 
  }); 

});