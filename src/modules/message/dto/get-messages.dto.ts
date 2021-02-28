import { ApiProperty } from '@nestjs/swagger';

export class IGetMessagesDTO {
  @ApiProperty()
  chatId: number
}
