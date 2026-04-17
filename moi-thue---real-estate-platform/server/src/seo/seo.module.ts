import { Module } from '@nestjs/common';
import { SeoController } from './seo.controller';
import { SitemapService } from './sitemap.service';

@Module({
  controllers: [SeoController],
  providers: [SitemapService],
})
export class SeoModule {}
