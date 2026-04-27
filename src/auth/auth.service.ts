import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(email: string, pass: string) {
    // ユーザーをメールアドレスで探す
    const user = await this.usersService.findOneByEmail(email);
    
    // ユーザーが存在しない、または暗号化パスワードが一致しなかったらエラー
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('メールアドレスかパスワードが違います');
    }

    // パスワードが合っていたら、入場パス（JWT）を発行する
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}