import { ApiProperty } from '@nestjs/swagger';

export class AddParticipantDTO {
  @ApiProperty()
  login: string

  @ApiProperty()
  chatId: number
}
