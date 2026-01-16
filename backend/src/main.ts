import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  app.enableCors(); // Enable CORS for frontend
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`System Online. Uplink established on port ${port}/api`);
}
bootstrap();
