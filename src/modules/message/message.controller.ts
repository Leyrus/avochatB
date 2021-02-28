import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResultOutput } from '../../utils/response';

@ApiTags('message')
@Controller('message')
export class MessageController {
  @Get('get')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  getMessage(): any {
    return ResultOutput.success({});
  }

  @Post('send')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  sendMessage(): any {
    return ResultOutput.success({});
  }

  @Post('delete')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  deleteMessage(): any {
    return ResultOutput.success({});
  }

  @Post('edit')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  editMessage(): any {
    return ResultOutput.success({});
  }
}
