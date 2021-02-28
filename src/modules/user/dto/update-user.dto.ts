import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @ApiProperty()
  @MinLength(4)
  @IsOptional()
  readonly login?: string;

  @ApiProperty()
  @IsOptional()
  readonly name?: string;

  @ApiProperty()
  @IsOptional()
  @Matches(/[a-z]{2}/,
    { message: 'Not valid lang code' })
  readonly lang?: string = 'en';
}
