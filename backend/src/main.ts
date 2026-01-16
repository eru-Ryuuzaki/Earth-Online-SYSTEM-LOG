import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  // Enable CORS with specific options for better compatibility
  app.enableCors({
    origin: true, // Reflect the request origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  const port = process.env.PORT || 3000;
  // Bind to 0.0.0.0 to ensure it works in containerized environments like Zeabur
  await app.listen(port, '0.0.0.0');
  console.log(`System Online. Uplink established on port ${port}/api`);
}
bootstrap();
