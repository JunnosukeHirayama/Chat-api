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
import { JwtService } from '@nestjs/jwt'; // 追加

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService, // 追加
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
      // 1. クライアントから送られてきたトークンを取り出す
      // 送信データに { token: '...', content: '...' } という形を期待します
      const { token, content } = body;

      // 2. トークンを解析してユーザー情報を取得
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'secretKey',
      });
      const userId = payload.sub; // 設定したユーザーID

      if (!content || !content.trim()) return;

      // 3. 本物のユーザーIDでDBに保存
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