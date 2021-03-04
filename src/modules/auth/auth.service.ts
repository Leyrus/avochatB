import * as _ from 'lodash';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { SignOptions } from 'jsonwebtoken';
import {
  BadRequestException, forwardRef,
  Inject,
  Injectable,
  MethodNotAllowedException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { CreateUserTokenDto } from '../token/dto/create-user-token.dto';
import { IUser, IReadableUser } from '../user/interfaces/user.interface';
import { MailService } from '../mail/mail.service';
import { statusEnum } from '../user/enums/status.enum';
import { userSensitiveFieldsEnum } from '../user/enums/protected-fields.enum';
import { config } from '../../config';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { SingUpAuthDto } from './dto/sing-up-auth.dto';
import { ITokenPayload } from './interfaces/token-payload.interface';
import { SignInAuthDto } from './dto/sign-in-auth.dto';
import { ChangePasswordAuthDto } from './dto/change-password-auth.dto';
import { ForgotPasswordAuthDto } from './dto/forgot-password-auth.dto';

@Injectable()
export class AuthService {
  private readonly clientAppUrl: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => UserService))
    private readonly usersRepository: Repository<UserEntity>,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {
    this.clientAppUrl = config.feAppUrl;
  }

  async signUp(createUserDto: SingUpAuthDto): Promise<boolean> {
    const user = await this.userService.create(createUserDto);
    await this.sendConfirmation(user);
    return true;
  }

  async updateUser(id: number, data: UpdateUserDto = {}): Promise<IReadableUser> {
    try {
      await this.usersRepository.update(id, data);
      const user = await this.userService.findById(id);
      const payload = { id };
      const accessToken = this.jwtService.sign(payload);
      return { ...user, accessToken };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async signIn(signInDto: SignInAuthDto, checkPassword = true): Promise<IReadableUser> {
    const { login, password } = signInDto;
    const user = isEmail(login)
      ? await this.userService.findByEmail(login, true)
      : await this.userService.findByLogin(login, true);

    if (checkPassword) {
      await this.checkIsValidPassword(password, user);
    }

    const token = await this.signUser(user);
    const readableUser = user as IReadableUser;
    readableUser.accessToken = token;

    return _.omit<IReadableUser>(
      readableUser,
      Object.values(userSensitiveFieldsEnum),
    ) as IReadableUser;
  }

  async signUser(user: IUser, withStatusCheck = true): Promise<string> {
    if (withStatusCheck && (user.status !== statusEnum.active)) {
      throw new MethodNotAllowedException();
    }
    const tokenPayload: ITokenPayload = {
      id: user.id,
      status: user.status,
      roles: user.roles,
    };
    const token = await this.generateToken(tokenPayload);

    const expireAt = moment()
      .add(1, 'day')
      .toISOString();

    await this.saveToken({
      token,
      expireAt,
      userId: user.id,
    });

    return token;
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordAuthDto): Promise<boolean> {
    const user = await this.userService.findById(userId);
    const { oldPassword, newPassword } = changePasswordDto;

    await this.checkIsValidPassword(oldPassword, user);

    await this.userService.updatePassword(userId, newPassword);
    await this.tokenService.deleteAll(userId);
    return true;
  }

  async confirm(token: string): Promise<IReadableUser> {
    const data = await this.verifyToken(token);
    const user = await this.userService.findById(data.id);

    await this.tokenService.delete(data.id, token);

    if (user && user.status === statusEnum.pending) {
      user.status = statusEnum.active;
      await this.userService.update(user.id, user);
      const signInDto = { login: user.login };
      return await this.signIn(signInDto, false);
    }
    throw new BadRequestException('Confirmation error');
  }

  async sendConfirmation(user: UserEntity): Promise<boolean> {
    const token = await this.signUser(user, false);
    const confirmLink = `${this.clientAppUrl}/confirm?token=${token}`;

    await this.mailService.send({
      from: `Excited User <${config.jsCodeMail}>`,
      to: [user.email],
      subject: 'Verify User',
      html: `
                <h3>Hello ${user.name || user.login}!</h3>
                <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p>
            `,
    });
    return true;
  }

  private async generateToken(data: ITokenPayload, options?: SignOptions): Promise<string> {
    return this.jwtService.sign(data, options);
  }

  private async verifyToken(token): Promise<ITokenPayload> {
    try {
      const data = this.jwtService.verify(token) as ITokenPayload;
      const tokenExists = await this.tokenService.exists(data.id, token);

      if (tokenExists) {
        return data;
      }
    } catch (err) {
      throw new UnauthorizedException(err);
    }
    throw new UnauthorizedException();
  }

  private async saveToken(createUserTokenDto: CreateUserTokenDto): Promise<boolean> {
    await this.tokenService.create(createUserTokenDto);
    return true;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordAuthDto): Promise<boolean> {
    const user = await this.userService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new BadRequestException('Invalid email');
    }
    const token = await this.signUser(user);
    const forgotLink = `${this.clientAppUrl}/auth/forgotPassword?token=${token}`;

    await this.mailService.send({
      from: `Excited User <${config.jsCodeMail}>`,
      to: user.email,
      subject: 'Forgot Password',
      html: `
                <h3>Hello ${user.name || user.login}!</h3>
                <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
            `,
    });
    return true;
  }

  async checkIsValidPassword(password: string, user: UserEntity) {
    if (!user) {
      throw new UnauthorizedException();
    }

    const isValid = await user.comparePassword(password);

    if (!isValid) {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
