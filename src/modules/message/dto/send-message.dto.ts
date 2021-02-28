import { ApiProperty } from '@nestjs/swagger';

export class SendMessagesDTO {
  @ApiProperty()
  chatId: number;

  @ApiProperty()
  message: string;
}
