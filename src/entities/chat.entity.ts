import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    chatId: number;

    @Column()
    name: string;

    @Column()
    userOwnerId: number;

    @ManyToMany(() => User, user => user.chats)
    public users: User[]
}
