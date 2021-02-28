import { Body, Controller, Get, Post, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResultOutput } from '../../utils/response';
import { IResponsePromise } from '../../types';
import { GetUser } from '../../components/decorators/get-user.decorator';
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
  async getMessage(
    @Query('chatId') chatId,
  ): IResponsePromise<IMessage[]> {
    const result = await this.messageService.getMessages(chatId);
    return ResultOutput.success(result);
  }

  @Post('send')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async sendMessage(
    @GetUser() user: IUserAuth,
    @Body(new ValidationPipe()) sendMessageDto: SendMessagesDTO,
  ): IResponsePromise<IMessage> {
    const result = await this.messageService.sendMessage(sendMessageDto, user.id);
    return ResultOutput.success(result);
  }

  @Post('delete')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async deleteMessage(
    @Body(new ValidationPipe()) deleteMessageDto: DeleteMessagesDTO,
  ): IResponsePromise<IDeleteMessageRes> {
    const result = await this.messageService.deleteMessage(deleteMessageDto);
    return ResultOutput.success(result);
  }

  @Post('edit')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async editMessage(
    @Body(new ValidationPipe()) editMessageDto: EditMessageDTO,
  ): IResponsePromise<IMessage> {
    const result = await this.messageService.editMessage(editMessageDto);
    return ResultOutput.success(result);
  }
}
