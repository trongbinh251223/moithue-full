import { Controller, Get, Header } from '@nestjs/common';
import { SitemapService } from './sitemap.service';

@Controller()
export class SeoController {
  constructor(private readonly sitemapService: SitemapService) {}

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  sitemap(): string {
    const siteUrl = process.env.SITE_URL ?? 'http://localhost:3000';
    return this.sitemapService.buildXml(siteUrl);
  }

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=86400')
  robots(): string {
    const siteUrl = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
    return [
      'User-agent: *',
      'Allow: /',
      '',
      `# Sitemap (served by Nest — same host in production)`,
      `Sitemap: ${siteUrl}/sitemap.xml`,
      '',
    ].join('\n');
  }
}
