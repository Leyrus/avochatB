import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../../entity/abstract-entity';

@Entity('token')
export class TokenEntity extends AbstractEntity {
  @Column()
  userId: number;

  @Column()
  token: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column()
  expireAt: string;
}

