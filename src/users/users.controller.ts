import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common'; // Get, Param, Patch, Delete を追加
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Update用DTOもインポート

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // アカウント作成用： POST /users
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 全ユーザー取得： GET /users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 特定ユーザー取得： GET /users/:id （友達追加時に使用）
  @Get(':id')
  findOne(@Param('id') id: string) {
    // URLのパラメーターは文字列として受け取るため、+ をつけて数値(number)に変換
    return this.usersService.findOne(+id);
  }

  // ユーザー情報更新： PATCH /users/:id
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // ユーザー削除： DELETE /users/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}