import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordAuthDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
