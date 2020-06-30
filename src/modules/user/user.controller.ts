import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { INewUserDTO, IUserDTO } from './user.interface';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('get')
    findUser(@Body() body: IUserDTO) {
        return this.userService.findUser(body);
    }

    @Post('create')
    createUser(@Body() body: INewUserDTO) {
        return this.userService.createUser(body);
    };
}
