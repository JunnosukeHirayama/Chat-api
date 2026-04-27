import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'secretKey',
      signOptions: { expiresIn: '1d' }, // 1日で有効期限切れになる設定
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}