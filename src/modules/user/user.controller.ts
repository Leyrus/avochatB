import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../components/decorators/get-user.decorator';
import { IResponsePromise } from '../../types';
import { ResultOutput } from '../../utils/response';
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
  async getUser(@GetUser() user: IUserAuth): IResponsePromise<IReadableUser> {
    const readableUser = await this.userService.findReadableUser(user);
    return ResultOutput.success(readableUser);
  }

  @Post('edit')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async editUser(
    @GetUser() user: IUserAuth,
    @Body(new ValidationPipe())
      data: UpdateUserDto,
  ): IResponsePromise<IReadableUser> {
    const newUser = await this.authService.updateUser(user.id, data);
    return ResultOutput.success(newUser);
  }
}
