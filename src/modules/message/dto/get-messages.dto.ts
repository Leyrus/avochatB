import { ApiProperty } from '@nestjs/swagger';

export class GetMessagesDTO {
  @ApiProperty()
  chatId: number
}
