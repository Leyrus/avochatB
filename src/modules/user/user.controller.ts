import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { IEditUserDTO, INewUserDTO, IUserDTO } from './user.interface';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('getUser')
    findUser(@Body() body: IUserDTO) {
        return this.userService.findUser(body);
    }

    @Post('createUser')
    createUser(@Body() body: INewUserDTO) {
        return this.userService.createUser(body);
    };

    @Post('editUser')
    editUser(@Body() body: IEditUserDTO) {
        return this.userService.editUser(body);
    }
}
