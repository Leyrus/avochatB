import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userOwnerId: number;

  @ManyToMany(() => UserEntity, user => user.chats)
  public users: UserEntity[]
}
