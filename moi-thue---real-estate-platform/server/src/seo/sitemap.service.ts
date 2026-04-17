import { Injectable } from '@nestjs/common';
import { SITEMAP_BLOG_IDS, SITEMAP_PATHS, SITEMAP_PROPERTY_IDS } from './seo.constants';

@Injectable()
export class SitemapService {
  buildXml(siteUrl: string): string {
    const base = siteUrl.replace(/\/$/, '');
    const urls: string[] = [];

    for (const path of SITEMAP_PATHS) {
      urls.push(this.urlEntry(base, path));
    }
    for (const id of SITEMAP_BLOG_IDS) {
      urls.push(this.urlEntry(base, `/blog/${id}`));
    }
    for (const id of SITEMAP_PROPERTY_IDS) {
      urls.push(this.urlEntry(base, `/property/${id}`));
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
  }

  private urlEntry(base: string, path: string): string {
    const loc = `${base}${path === '/' ? '' : path}`;
    return `  <url>
    <loc>${this.escapeXml(loc)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  }

  private escapeXml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
