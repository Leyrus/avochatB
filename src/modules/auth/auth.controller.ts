import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IReadableUser, IUserAuth } from '../user/interfaces/user.interface';
import { ResultOutput } from '../../utils/response';
import { IResponsePromise } from '../../types';
import { GetUser } from '../../components/decorators/get-user.decorator';
import { SingUpAuthDto } from './dto/sing-up-auth.dto';
import { ConfirmAccountAuthDto } from './dto/confirm-account-auth.dto';
import { ForgotPasswordAuthDto } from './dto/forgot-password-auth.dto';
import { ChangePasswordAuthDto } from './dto/change-password-auth.dto';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/confirm')
  async confirm(
    @Query(new ValidationPipe()) query: ConfirmAccountAuthDto,
  ): IResponsePromise<IReadableUser> {
    const result = await this.authService.confirm(query.token);
    return ResultOutput.success(result);
  }

  @Post('/signUp')
  async signUp(
    @Body(new ValidationPipe()) createUserDto: SingUpAuthDto,
  ): IResponsePromise<boolean> {
    const result = await this.authService.signUp(createUserDto);
    return ResultOutput.success(result);
  }

  @Post('/signIn')
  signIn(
    @Body(new ValidationPipe()) signInDto: SignInAuthDto,
  ): Promise<IReadableUser> {
    return this.authService.signIn(signInDto);
  }

  @Post('/forgotPassword')
  forgotPassword(
    @Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordAuthDto,
  ): Promise<boolean> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('/changePassword')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  changePassword(
    @GetUser() user: IUserAuth,
    @Body(new ValidationPipe()) changePasswordDto: ChangePasswordAuthDto,
  ): Promise<boolean> {
    return this.authService.changePassword(user.id, changePasswordDto);
  }
}
