import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { JwtModule } from '@nestjs/jwt'; 
import { UsersModule } from '../users/users.module'; 

@Module({
  imports: [
    UsersModule,
    // auth.module.ts と同じ設定にする
    JwtModule.register({
      global: true,
      secret: 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}