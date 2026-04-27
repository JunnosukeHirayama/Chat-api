import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '名前は必須です' })
  name: string;

  @IsEmail({}, { message: '正しいメールアドレスの形式で入力してください' })
  @IsNotEmpty({ message: 'メールアドレスは必須です' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'パスワードは6文字以上で入力してください' })
  password: string;
}