import { ApiProperty } from '@nestjs/swagger';

export class ISendMessagesDTO {
  @ApiProperty()
  login: string

  @ApiProperty()
  chatId: number

  @ApiProperty()
  message: string
}
