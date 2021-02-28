import { ApiProperty } from '@nestjs/swagger';

export class DeleteMessagesDTO {
  @ApiProperty()
  messageId: number;
}
