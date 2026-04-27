import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt'; 

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService, 
  ) {}

  async handleConnection(client: Socket) {
    console.log(`接続試行: ${client.id}`);
    const messages = await this.chatService.getAllMessages();
    client.emit('loadMessages', messages);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() body: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      // クライアントから送られてきたトークンを取り出す
      // 送信データに { token: '...', content: '...' } という形を期待
      const { token, content } = body;

      // トークンを解析してユーザー情報を取得
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'secretKey',
      });
      const userId = payload.sub; // 設定したユーザーID

      if (!content || !content.trim()) return;

      // 本物のユーザーIDでDBに保存
      const savedMessage = await this.chatService.createMessage(content.trim(), userId);

      if (savedMessage) {
        this.server.emit('receiveMessage', savedMessage);
      }
    } catch (e) {
      console.error('認証エラー:', e);
      client.emit('error', '認証に失敗しました。ログインし直してください。');
    }
  }
}