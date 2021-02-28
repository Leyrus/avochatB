import { ApiProperty } from '@nestjs/swagger';

export class IEditMessageDTO {
  @ApiProperty()
  messageId: number

  @ApiProperty()
  message: string
}
