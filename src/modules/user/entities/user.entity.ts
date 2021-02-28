import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { classToPlain, Exclude } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { AbstractEntity } from '../../../entity/abstract-entity';
import { IUserResponse } from '../interfaces/user.interface';

@Entity('user')
export class UserEntity extends AbstractEntity {
    @Column({ default: 'ru' })
    lang: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ unique: true })
    login: string;

    @Column({ nullable: true })
    name: string | null;

    @Column()
    @Exclude()
    password: string;

    @Column()
    status: string;

    @Column({ default: 'user' })
    roles: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password,10);
    }

    async comparePassword(attempt: string) {
        return await bcrypt.compare(attempt, this.password);
    }

    toJSON(): IUserResponse {
        return <IUserResponse>classToPlain(this);
    }
}
