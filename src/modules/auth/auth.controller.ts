import { AuthGuard } from '@nestjs/passport';
import {
  Controller, Post, Body, ValidationPipe, Get, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IReadableUser, IUserAuth } from '../user/interfaces/user.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ResultOutput } from '../../utils/response';
import { IResponsePromise } from '../../types';
import { GetUser } from '../../components/decorators/get-user.decorator';
import { ConfirmAccountDto } from './dto/confirm-account.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @Post('/signUp')
  async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto): IResponsePromise<boolean> {
    const result = await this.authService.signUp(createUserDto);
    return ResultOutput.success(result);
  }

  @Get('/confirm')
  async confirm(@Query(new ValidationPipe()) query: ConfirmAccountDto): IResponsePromise<boolean> {
    const result = await this.authService.confirm(query.token);
    return ResultOutput.success(result);
  }

  @Post('/signIn')
  async signIn(@Body(new ValidationPipe()) signInDto: SignInDto): Promise<IReadableUser> {
    const result = await this.authService.signIn(signInDto);
    console.log(result, 'myLog result');
    return ResultOutput.success(result);
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto): Promise<boolean> {
    const result = await this.authService.forgotPassword(forgotPasswordDto);
    return ResultOutput.success(result);
  }

  @Post('/changePassword')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async changePassword(
    @GetUser() user: IUserAuth,
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const result = await this.authService.changePassword(user.id, changePasswordDto);
    return ResultOutput.success(result);
  }
}
