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
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService, 
  ) {}

  // 接続時の処理
  async handleConnection(client: Socket) {
    console.log(`接続試行: ${client.id}`);
  }

  // 自分の専用ルームに入る処理
  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: { userId: number }, @ConnectedSocket() client: Socket) {
    client.join(data.userId.toString());
    console.log(`User ${data.userId} joined their private room`);
  }

  // メッセージ送信処理（1対1のロジックに統一）
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() body: SendMessageDto, 
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { token, content, recipientId } = body; 
      
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const senderId = payload.sub;

      if (!content || !content.trim()) return;

      // DBに保存
      const savedMessage = await this.chatService.createMessage(content.trim(), senderId, recipientId);

      if (savedMessage) {
        // 相手の「専用ルーム」にだけメッセージを送る
        this.server.to(recipientId.toString()).emit('receiveMessage', savedMessage);
        
        // 自分自身にも送る（自分の画面に反映させるため）
        client.emit('receiveMessage', savedMessage);
      }
    } catch (e) {
      console.error('認証エラー:', e);
      client.emit('error', '認証に失敗しました。ログインし直してください。');
    }
  }

  // 過去の会話履歴を取得する処理
  @SubscribeMessage('getHistory')
  async handleGetHistory(
    @MessageBody() data: { token: string; targetId: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const payload = await this.jwtService.verifyAsync(data.token, {
      secret: process.env.JWT_SECRET,
      });
      const userId = payload.sub;

      // 二人の間の過去ログを取得
      const history = await this.chatService.getConversation(userId, data.targetId);
      
      // 依頼してきた本人にだけ履歴を返す
      client.emit('loadHistory', history);
    } catch (e) {
      client.emit('error', '履歴の取得に失敗しました');
    }
  }
}