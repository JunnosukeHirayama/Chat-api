import 'dotenv/config'; // 1番上
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORSを有効化（スペルミスを修正しました：enableCros -> enableCors）
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();