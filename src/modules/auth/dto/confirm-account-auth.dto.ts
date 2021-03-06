import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmAccountAuthDto {
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}
