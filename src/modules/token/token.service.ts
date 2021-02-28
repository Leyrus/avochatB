import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserTokenDto } from './dto/create-user-token.dto';
import { TokenEntity } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private tokensRepository: Repository<TokenEntity>,
  ) {}

  async create(createUserTokenDto: CreateUserTokenDto): Promise<boolean> {
    await this.tokensRepository
      .save(createUserTokenDto);
    return true;
  }

  async delete(userId: number, token: string): Promise<boolean> {
    await this.tokensRepository
      .delete({ userId, token });
    return true;
  }

  async deleteAll(userId: number): Promise<boolean> {
    await this.tokensRepository
      .delete({ userId });
    return true;
  }

  async exists(userId: number, token: string): Promise<boolean> {
    const userToken = await this.tokensRepository
      .findOne({ userId, token });
    return !!userToken;
  }
}
