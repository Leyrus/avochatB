import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Chat } from './chat.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column()
    name: string;

    @Column()
    login: string;

    @Column()
    password: string;

    @ManyToMany(() => Chat, (chat: Chat) => chat.users)
    @JoinTable()
    public chats: Chat[]
}
