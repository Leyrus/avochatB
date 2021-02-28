import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  messageId: number;

  @Column()
  chatId: number;

  @Column()
  userId: number;

  @Column()
  message: string;

  @Column()
  dateCreate: Date;

  @Column({ nullable: true })
  dateChange?: Date | null;
}
