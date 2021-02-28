import { ApiProperty } from '@nestjs/swagger';

export class DeleteParticipantDTO {
  @ApiProperty()
  login: string;

  @ApiProperty()
  chatId: number;
}
