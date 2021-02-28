import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDTO {
  @ApiProperty()
  login: string

  @ApiProperty()
  chatName: string
}
