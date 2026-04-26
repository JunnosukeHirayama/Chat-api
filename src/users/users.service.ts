import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt'; 

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

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

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}