import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

// サーバー起動時に .env を強制読み込み
dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. PostgreSQLの接続プールを作成
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // 2. Prisma用のPGアダプターを作成
    const adapter = new PrismaPg(pool);

    // 3. アダプターをPrismaClientのコンストラクタに渡す（これがエラーが要求していた正解です）
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('データベースに接続成功しました');
    } catch (e) {
      console.error('データベース接続エラー:', e);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}