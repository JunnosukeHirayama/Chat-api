import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ログインはデータを送る処理なので @Post を使います
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() signInDto: SignInDto) {
    return this.authService.login(signInDto.email, signInDto.password);
  }
}