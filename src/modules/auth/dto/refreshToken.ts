import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RefreshTokenDTO {
  @IsString()
  @ApiProperty()
  @MinLength(8)
  readonly refreshToken: string;
}
