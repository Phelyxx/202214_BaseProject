import { CoffeEntity } from '../coffe/coffe.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StoreEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 name: string;
 
 @Column()
 address: string;

 @Column()
 phone: string;

 @ManyToMany(() => CoffeEntity, coffe => coffe.stores)
 @JoinTable()
 coffes: CoffeEntity[];
}