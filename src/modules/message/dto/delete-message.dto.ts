import { ApiProperty } from '@nestjs/swagger';

export class IDeleteMessagesDTO {
  @ApiProperty()
  messageId: number
}
