import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginDto,
  VerifyEmailDto,
} from './user/dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
    return { message: 'User registered successfully, check your email' };
  }

  @Post('verify')
  async verify(@Body() verifyEmailDto: VerifyEmailDto) {
    await this.usersService.verifyUser(verifyEmailDto);
    return { message: 'user verified successfully' };
  }

  @Get('all')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('findByEmail/:email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @Post('changePassword/:id')
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }
}
