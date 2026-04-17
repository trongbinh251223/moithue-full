function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  const selector = `meta[${attr}="${CSS.escape(key)}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string): void {
  const selector = `link[rel="${CSS.escape(rel)}"]`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applyPageSeo(opts: {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogImage: string;
  siteName: string;
}): void {
  const { title, description, keywords, canonical, ogImage, siteName } = opts;

  document.documentElement.lang = 'vi';
  document.title = title;

  upsertMeta('name', 'description', description);
  const existingKw = document.head.querySelector('meta[name="keywords"]');
  if (keywords) {
    upsertMeta('name', 'keywords', keywords);
  } else {
    existingKw?.remove();
  }

  upsertLink('canonical', canonical);

  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:site_name', siteName);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('property', 'og:locale', 'vi_VN');
  upsertMeta('property', 'og:image', ogImage);

  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', ogImage);
  upsertMeta('name', 'robots', 'index, follow');
}
