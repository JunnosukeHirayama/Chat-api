import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello')
  getMathGraduateHello(): string {
    return '皆さんこんにちは、数学の美しさを追求する大学院生です。今日も楽しく数式と向き合いましょう！';
  }
}
