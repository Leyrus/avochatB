import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ResultOutput } from '../../utils/response';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  @Post('create')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  createChat(): any {
    return ResultOutput.success({});
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
