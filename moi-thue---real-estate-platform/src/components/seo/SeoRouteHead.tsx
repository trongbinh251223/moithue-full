import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_NAME } from '@/constants/site';
import { DEFAULT_OG_IMAGE, getPublicSiteUrl, resolvePageSeo } from '@/constants/seoRoutes';
import { applyPageSeo } from '@/utils/documentSeo';

/** Updates document title & meta tags on SPA navigation (React 19–safe, no react-helmet peer issues). */
export default function SeoRouteHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = resolvePageSeo(pathname);
    const siteUrl = getPublicSiteUrl();
    const canonical = `${siteUrl}${pathname === '/' ? '' : pathname}`;

    applyPageSeo({
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
      canonical,
      ogImage: DEFAULT_OG_IMAGE,
      siteName: SITE_NAME,
    });
  }, [pathname]);

  return null;
}
