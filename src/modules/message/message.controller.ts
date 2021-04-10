import { Body, Controller, Get, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { IUserAuth } from '../user/interfaces/user.interface';
import { MessageService } from './message.service';
import { SendMessagesDTO } from './dto/send-message.dto';
import { DeleteMessagesDTO } from './dto/delete-message.dto';
import { EditMessageDTO } from './dto/edit-message.dto';
import { IDeleteMessageRes, IMessage } from './interfaces/message';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('get')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiQuery({ name: 'chatId', type: 'number', required: true })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  getMessage(
    @Query('chatId') chatId,
    @Query('limit') limit,
    @Query('offset') offset,
    @GetUser() user: IUserAuth,
  ): Promise<IMessage[]> {
    return this.messageService.getMessages({
      userId: user.id,
      chatId,
      offset,
      limit,
    });
  }

  @Post('send')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  sendMessage(
    @GetUser() user: IUserAuth,
    @Body(new ValidationPipe()) sendMessageDto: SendMessagesDTO,
  ): Promise<IMessage> {
    return this.messageService.sendMessage(sendMessageDto, user.id);
  }

  @Post('delete')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  deleteMessage(
    @Body(new ValidationPipe()) deleteMessageDto: DeleteMessagesDTO,
  ): Promise<IDeleteMessageRes> {
    return this.messageService.deleteMessage(deleteMessageDto);
  }

  @Post('edit')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  editMessage(
    @Body(new ValidationPipe()) editMessageDto: EditMessageDTO,
  ): Promise<IMessage> {
    return this.messageService.editMessage(editMessageDto);
  }
}
