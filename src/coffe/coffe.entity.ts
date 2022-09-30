import { StoreEntity } from '../store/store.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CoffeEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 name: string;
 
 @Column()
 description: string;

 @Column()
 price: number;

 @ManyToMany(() => StoreEntity, store => store.coffes)
 stores: StoreEntity[];
}