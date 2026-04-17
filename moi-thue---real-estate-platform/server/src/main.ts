import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'sitemap.xml', method: RequestMethod.GET },
      { path: 'robots.txt', method: RequestMethod.GET },
    ],
  });

  const webOrigins = (process.env.WEB_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: webOrigins,
    credentials: true,
  });

  const port = Number(process.env.PORT ?? 3333);
  await app.listen(port);
  console.log(`API + SEO listening on http://localhost:${port} (sitemap & robots at root path)`);
}

bootstrap();
