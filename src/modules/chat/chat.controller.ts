import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResultOutput } from '../../utils/response';
import { IResponsePromise } from '../../types';
import { ChatService } from './chat.service';
import { CreateChatDTO } from './dto/create-chat.dto';
import { IChat } from './interfaces/chat.interface';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('create')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async createChat(
    @Body(new ValidationPipe()) createChatDTO: CreateChatDTO,
  ): IResponsePromise<IChat> {
    const result = await this.chatService.createChat(createChatDTO);
    return ResultOutput.success(result);
  }

  @Post('delete')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  deleteChat(): any {
    return ResultOutput.success({});
  }

  @Post('addUserToChat')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  addUserToChat(): any {
    return ResultOutput.success({});
  }

  @Post('deleteUserFromChat')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  deleteUserFromChat(): any {
    return ResultOutput.success({});
  }

  @Post('edit')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  editChat(): any {
    return ResultOutput.success({});
  }

  @Get('getParticipants')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  getParticipants(): any {
    return ResultOutput.success({});
  }
}
