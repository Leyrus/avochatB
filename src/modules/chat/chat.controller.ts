import { Body, Controller, Get, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResultOutput } from '../../utils/response';
import { IResponsePromise } from '../../types';
import { GetUser } from '../../components/decorators/get-user.decorator';
import { IReadableUser, IUserAuth } from '../user/interfaces/user.interface';
import { ChatService } from './chat.service';
import { CreateChatDTO } from './dto/create-chat.dto';
import {
  IChat, IDeleteChatRes,IAddParticipantRes, IDeleteParticipantRes,
} from './interfaces/chat.interface';
import { DeleteChatDTO } from './dto/delete-participants.dto';
import { EditChatDTO } from './dto/edit-chat.dto';
import { AddParticipantDTO } from './dto/add-participant.dto';
import { DeleteParticipantDTO } from './dto/delete-participant.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('getParticipants')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiQuery({ name: 'chatId', type: 'number', required: true })
  async getParticipants(
    @Query('chatId') chatId,
  ): IResponsePromise<IReadableUser[]> {
    const result = await this.chatService.getParticipants(chatId);
    return ResultOutput.success(result);
  }

  @Post('create')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async createChat(
    @GetUser() user: IUserAuth,
    @Body(new ValidationPipe()) createChatDTO: CreateChatDTO,
  ): IResponsePromise<IChat> {
    const result = await this.chatService.createChat(createChatDTO, user.id);
    return ResultOutput.success(result);
  }

  @Post('delete')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async deleteChat(
    @Body(new ValidationPipe()) deleteChatDTO: DeleteChatDTO,
  ): IResponsePromise<IDeleteChatRes> {
    const result = await this.chatService.deleteChat(deleteChatDTO);
    return ResultOutput.success(result);
  }

  @Post('edit')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async editChat(@Body(
    new ValidationPipe()) editChatDTO: EditChatDTO,
  ): IResponsePromise<IChat> {
    const result = await this.chatService.editChat(editChatDTO);
    return ResultOutput.success(result);
  }

  @Post('addUserToChat')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async addParticipantToChat(
    @Body(new ValidationPipe()) addParticipantDto: AddParticipantDTO,
  ): IResponsePromise<IAddParticipantRes> {
    const result = await this.chatService.addParticipantToChat(
      addParticipantDto,
    );
    return ResultOutput.success(result);
  }

  @Post('deleteUserFromChat')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async deleteParticipantFromChat(
    @Body(new ValidationPipe()) deleteParticipantDto: DeleteParticipantDTO,
  ): IResponsePromise<IDeleteParticipantRes> {
    const result = await this.chatService.deleteParticipantFromChat(
      deleteParticipantDto,
    );
    return ResultOutput.success(result);
  }
}
