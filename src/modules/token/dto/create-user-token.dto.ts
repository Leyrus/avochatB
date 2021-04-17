import { IsString, IsDateString, IsNumber } from 'class-validator';

export class CreateUserTokenDto {
  @IsNumber()
  userId: number;

  @IsString()
  token: string;

  @IsString()
  refreshToken: string;

  @IsDateString()
  expireAt: string;
}
