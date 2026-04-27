import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // 新しいメッセージを保存する（送信者と受信者を記録）
  async createMessage(content: string, senderId: number, recipientId: number) {
    return this.prisma.message.create({
      data: {
        content: content,
        senderId: senderId,
        recipientId: recipientId,
      },
      include: {
        sender: { select: { name: true } } 
      }
    });
  }

  // 特定の2人の間の会話履歴だけを取得する
  async getConversation(userId: number, targetId: number) {
    return this.prisma.message.findMany({
      where: {
        // Aさん→Bさん、または Bさん→Aさん のメッセージを探す
        OR: [
          { senderId: userId, recipientId: targetId },
          { senderId: targetId, recipientId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { name: true } }
      }
    });
  }
}