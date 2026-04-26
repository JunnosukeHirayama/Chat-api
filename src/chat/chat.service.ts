import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // 第2引数に userId: number をしっかり追加します
  async createMessage(content: string, userId: number) {
    return this.prisma.message.create({
      data: {
        content: content,
        userId: userId, // 送信者のIDで保存
      },
      include: {
        user: { select: { name: true } }
      }
    });
  }

  async getAllMessages() {
    return this.prisma.message.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { name: true } }
      }
    });
  }
}