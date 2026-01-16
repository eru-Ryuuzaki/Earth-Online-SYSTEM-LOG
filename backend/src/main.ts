import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  // Enable CORS with specific options for production
  app.enableCors({
    origin: [
      process.env.CORS_ORIGIN || '*',
      'https://earth-online-system-log.zeabur.app', // Explicitly allow your frontend domain
      'http://localhost:5173' // Allow local dev
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`System Online. Uplink established on port ${port}/api`);
}
bootstrap();
