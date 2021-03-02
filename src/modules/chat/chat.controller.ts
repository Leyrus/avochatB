import { Body, Controller, Get, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../components/decorators/get-user.decorator';
import { IReadableUser, IUserAuth } from '../user/interfaces/user.interface';
import { ChatService } from './chat.service';
import { CreateChatDTO } from './dto/create-chat.dto';
import {
  IChat, IDeleteChatRes, IAddParticipantRes, IDeleteParticipantRes,
} from './interfaces/chat.interface';
import { DeleteChatDTO } from './dto/delete-chat.dto';
import { EditChatDTO } from './dto/edit-chat.dto';
import { AddParticipantChatDto } from './dto/add-participant-chat.dto';
import { DeleteParticipantChatDto } from './dto/delete-participant-chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('getParticipants')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiQuery({ name: 'chatId', type: 'number', required: true })
  getParticipants(
    @Query('chatId') chatId,
  ): Promise<IReadableUser[]> {
    return this.chatService.getParticipants(chatId);
  }

  @Post('create')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  createChat(
    @GetUser() user: IUserAuth,
    @Body(new ValidationPipe()) createChatDTO: CreateChatDTO,
  ): Promise<IChat> {
    return this.chatService.createChat(createChatDTO, user.id);
  }

  @Post('delete')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async deleteChat(
    @Body(new ValidationPipe()) deleteChatDTO: DeleteChatDTO,
  ): Promise<IDeleteChatRes> {
    return this.chatService.deleteChat(deleteChatDTO);
  }

  @Post('edit')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  editChat(@Body(
    new ValidationPipe()) editChatDTO: EditChatDTO,
  ): Promise<IChat> {
    return this.chatService.editChat(editChatDTO);
  }

  @Post('addUserToChat')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  addParticipantToChat(
    @Body(new ValidationPipe()) addParticipantDto: AddParticipantChatDto,
  ): Promise<IAddParticipantRes> {
    return this.chatService.addParticipantToChat(addParticipantDto);
  }

  @Post('deleteUserFromChat')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  deleteParticipantFromChat(
    @Body(new ValidationPipe()) deleteParticipantDto: DeleteParticipantChatDto,
  ): Promise<IDeleteParticipantRes> {
    return this.chatService.deleteParticipantFromChat(deleteParticipantDto);
  }
}
