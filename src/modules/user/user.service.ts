import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isEmpty } from 'lodash';
import * as bcrypt from 'bcrypt';
import { IEditUserDTO, INewUserDTO, IUserChange, IUserDTO } from './user.interface';
import { ResultOutput } from '../../utils/response';
import { User } from '../../entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    private logger: Logger = new Logger('ChatService');

    async findUser(body: IUserDTO) {
        const user = await this.usersRepository.findOne({
            login: body.login,
        }, { relations: ['chats'] });

        if (!user || !await bcrypt.compare(body.password, user.password)) {
            return ResultOutput.error('Invalid username or password');
        }

        user.isOnline = !!user.socketClientId;
        delete user.password;
        delete user.socketClientId;

        this.logger.log(`user: ${JSON.stringify(user)}`);

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

        newUser.isOnline = !!newUser.socketClientId;
        delete newUser.password;
        delete newUser.socketClientId;

        this.logger.log(`user: ${JSON.stringify(newUser)}`);

        return ResultOutput.success({ ...newUser, chats: [] });
    }

    async editUser(body: IEditUserDTO) {
        console.log('myLog body', body);
        const user = await this.usersRepository.findOne({
            userId: body.userId,
        });

        if (!user) {
            return ResultOutput.error('User already exists');
        }

        const changedFields: IUserChange = {};

        if (body.newLogin){
            const user = await this.usersRepository
                .findOne({ login: body.newLogin });

            if (user) {
                return ResultOutput.error('this login is busy');
            }

            changedFields.login = body.newLogin;
        }

        if (body.newName){
            changedFields.name = body.newName;
        }

        if (body.oldPassword && body.newPassword1 && body.newPassword2){
            if (!await bcrypt.compare(body.oldPassword, user.password)) {
                return ResultOutput.error('Invalid password');
            }
            if (body.newPassword1 !== body.newPassword2) {
                return ResultOutput.error('Different passwords');
            }
            changedFields.password = await bcrypt.hash(body.newPassword1, 10);
        }

        if (isEmpty(changedFields)) {
            return ResultOutput.error('Nothing to change');
        }

        await this.usersRepository.update({ userId: body.userId }, changedFields);

        return ResultOutput.success({ changedFields: changedFields });
    }

    async setOnline(userId: number, socketClientId: string) {
        await this.usersRepository.update({ userId }, {
            socketClientId,
        });
    }

    async setOffline(socketClientId: string) {
        await this.usersRepository.update({ socketClientId }, {
            socketClientId: '',
        });
    }
}
