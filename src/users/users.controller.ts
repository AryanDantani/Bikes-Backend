import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Header,
  Param,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from 'src/Common-DTO/Login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @Header('Cache-Control', 'POST')
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.signUp(createUserDto);
  }

  @Post('/login')
  @Header('Cache-Control', 'POST')
  login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Post('/forgot-password')
  async forgotPassword(@Body('email') email: string) {
    await this.usersService.sendPasswordResetEmail(email);
  }

  @Put('/:email/password')
  async updatePasswordByEmail(
    @Param('email') email: string,
    @Body('newPassword') newPassword: string,
  ) {
    console.log(email);
    await this.usersService.findUserAndUpdatePasswordByEmail(
      email,
      newPassword,
    );
    return { message: 'Password updated successfully' };
  }
}
