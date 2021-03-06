import { ApiProperty } from '@nestjs/swagger';

export class AddParticipantChatDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  chatId: number;
}
