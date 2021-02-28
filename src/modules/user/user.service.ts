import * as _ from 'lodash';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions } from 'typeorm/browser';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser, IReadableUser, IUserAuth } from './interfaces/user.interface';
import { userSensitiveFieldsEnum } from './enums/protected-fields.enum';
import { roleEnum } from './enums/role.enum';
import { statusEnum } from './enums/status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const user = this.usersRepository.create({
        ...createUserDto,
        status: statusEnum.pending,
        roles: roleEnum.user,
      });
      await user.save();
      return user;
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async update(userId: number, payload: Partial<IUser>): Promise<boolean> {
    await this.usersRepository.update({ id: userId }, payload);
    return true;
  }

  async updatePassword(userId: number, newPassword: string): Promise<boolean> {
    const password = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.update(
      { id: userId },
      { password },
    );
    return true;
  }

  async findById(id: number, withChats = false): Promise<UserEntity> {
    const options: FindOneOptions<UserEntity> = {};
    if (withChats) {
      options.relations = ['chats'];
    }
    return await this.usersRepository.findOne(
      id, options);
  }

  async findReadableUser(authUser: IUserAuth): Promise<IReadableUser> {
    const user = await this.findById(authUser.id, authUser.withChats);
    return _.omit(user, Object.values(userSensitiveFieldsEnum)) as IReadableUser;
  }
}
