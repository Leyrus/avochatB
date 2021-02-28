import { ApiProperty } from '@nestjs/swagger';

export class DeleteChatDTO {
  @ApiProperty()
  chatId: number
}
