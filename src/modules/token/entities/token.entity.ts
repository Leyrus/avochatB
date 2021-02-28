import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../entity/abstract-entity';

@Entity('token')
export class TokenEntity extends AbstractEntity{
  @Column()
  userId: number;

  @Column()
  token: string;

  @Column()
  expireAt: string;
}

