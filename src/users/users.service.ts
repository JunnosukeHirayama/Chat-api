import { Injectable, NotFoundException } from '@nestjs/common'; // NotFoundException を追加
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // アカウント作成
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
      },
    });
  }

  // 全ユーザー取得
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        // パスワードは含めない
      }
    });
  }

  // 特定のIDでユーザー検索（友達追加時に使用）
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      // 安全のため、パスワードは返さず、idとnameだけを返却
      select: {
        id: true,
        name: true,
      },
    });

    // ユーザーが見つからない場合は 404 エラーを投げる
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // ログイン用：メールアドレスで検索
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // ユーザー情報の更新
  async update(id: number, updateUserDto: UpdateUserDto) {
    const password =
      updateUserDto.password != null
        ? await bcrypt.hash(updateUserDto.password, 10)
        : undefined;

    return this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        name: updateUserDto.name,
        ...(password ? { password } : {}),
      },
    });
  }

  // ユーザー削除
  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}