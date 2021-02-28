import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateUserTokenDto {
  @IsNumber()
  userId: number;

  @IsString()
  token: string;

  @IsDateString()
  expireAt: string;
}
