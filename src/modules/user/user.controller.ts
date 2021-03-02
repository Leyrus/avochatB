import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { AuthService } from '../auth/auth.service';
import { IReadableUser, IUserAuth } from './interfaces/user.interface';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Get('get')
  @UseGuards(AuthGuard())
  @ApiQuery({ name: 'withChats', type: 'boolean', required: false })
  @ApiBearerAuth()
  getUser(
    @GetUser() user: IUserAuth,
  ): Promise<IReadableUser> {
    return this.userService.findReadableUser(user);
  }

  @Post('edit')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  editUser(
    @GetUser() user: IUserAuth,
    @Body(new ValidationPipe())
      data: UpdateUserDto,
  ): Promise<IReadableUser> {
    return this.authService.updateUser(user.id, data);
  }
}
