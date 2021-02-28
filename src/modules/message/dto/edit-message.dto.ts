import { ApiProperty } from '@nestjs/swagger';

export class EditMessageDTO {
  @ApiProperty()
  messageId: number

  @ApiProperty()
  message: string
}
