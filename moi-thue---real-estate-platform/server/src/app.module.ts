import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { SeoModule } from './seo/seo.module';

@Module({
  imports: [HealthModule, SeoModule],
})
export class AppModule {}
