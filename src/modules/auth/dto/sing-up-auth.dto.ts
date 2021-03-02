import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { Lang } from '../../../types/enum/lang';

export class SingUpAuthDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @ApiProperty()
  @MinLength(4)
  readonly login: string;

  @ApiProperty()
  readonly name?: string;

  @ApiProperty({ required: false, enum: Lang })
  @Matches(/[a-z]{2}/,
    { message: 'Not valid lang code' })
  readonly lang?: Lang = Lang.en;

  @ApiProperty()
  @IsString()
  @Matches(
    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
    { message: 'Weak password' },
  )
  readonly password: string;
}
