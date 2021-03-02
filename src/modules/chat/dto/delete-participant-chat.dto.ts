import { ApiProperty } from '@nestjs/swagger';

export class DeleteParticipantChatDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  chatId: number;
}
