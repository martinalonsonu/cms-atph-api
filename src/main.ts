import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/response.interceptor';

class Application {
  private app!: INestApplication;

  async bootstrap(): Promise<void> {
    this.app = await NestFactory.create(AppModule);

    this.configureCors();
    this.configurePipes();
    this.configureInterceptors();

    await this.app.listen(process.env.PORT ?? 3000);
  }

  private configureCors(): void {
    this.app.enableCors({
      origin: [
        process.env.BASE_PATH,
        'https://www.atuspieshumilde.com/',
        'https://atuspieshumilde.com',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  }

  private configurePipes(): void {
    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
  }

  private configureInterceptors(): void {
    this.app.useGlobalInterceptors(new ResponseInterceptor());
  }
}

new Application().bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
