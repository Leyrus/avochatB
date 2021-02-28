import { ApiProperty } from '@nestjs/swagger';

export class EditChatDTO {
  @ApiProperty()
  chatId: number;

  @ApiProperty()
  newName: string;
}
