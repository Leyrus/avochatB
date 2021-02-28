import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDTO {
  @ApiProperty()
  chatName: string;
}
