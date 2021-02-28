import { ApiProperty } from '@nestjs/swagger';

export class GetParticipantsDTO {
  @ApiProperty()
  chatId: number
}
