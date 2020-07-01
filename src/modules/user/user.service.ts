import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { INewUserDTO, IUserDTO } from './user.interface';
import { ResultOutput } from '../../utils/response';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async findUser(body: IUserDTO) {
        const user = await this.usersRepository.findOne({
            login: body.login,
        }, { relations: ['chats'] });

        if (!user || !await bcrypt.compare(body.password, user.password)) {
            return ResultOutput.error('Invalid username or password');
        }

        delete user.password;

        return ResultOutput.success(user);
    }

    async createUser(body: INewUserDTO) {
        if (body.password1 !== body.password2) {
            return ResultOutput.error('Different passwords');
        }
        const user = await this.usersRepository
            .findOne({ login: body.login });

        if (user) {
            return ResultOutput.error('User already exists');
        }

        const newUser = await this.usersRepository
            .save({
                login: body.login,
                name: body.name,
                password: await bcrypt.hash(body.password1, 10),
            });

        return ResultOutput.success(newUser);
    }
}
