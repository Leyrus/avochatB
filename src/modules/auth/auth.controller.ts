import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IReadableUser, IUserAuth } from '../user/interfaces/user.interface';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { GetToken } from '../../common/decorators/get-token.decarator';
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
  confirm(
    @Query(new ValidationPipe()) query: ConfirmAccountAuthDto,
  ): Promise<IReadableUser> {
    return this.authService.confirm(query.token);
  }

  @Post('/logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  logout(
    @GetToken() token: string,
  ): Promise<boolean> {
    return this.authService.logout(token);
  }

  @Post('/signUp')
  signUp(
    @Body(new ValidationPipe()) createUserDto: SingUpAuthDto,
  ): Promise<boolean> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signIn')
  async signIn(
    @Body(new ValidationPipe()) signInDto: SignInAuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<IReadableUser> {
    const result = await this.authService.signIn(signInDto);

    // TODO AV-167
    // response.cookie('Authentication', `Bearer ${result.accessToken}`);
    // delete result.accessToken;

    return result;
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
