import { Globe, Share2, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_EMAIL,
  SITE_ADDRESS,
  SITE_COPYRIGHT_YEAR,
} from '@/constants/site';
import { FOOTER_EXPLORE_LINKS, FOOTER_SUPPORT_LINKS } from '@/constants/footer';

export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full rounded-t-[32px] mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-12 py-20 max-w-7xl mx-auto text-sm leading-relaxed">
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-primary">{SITE_NAME}</h2>
          <p className="text-on-surface-variant max-w-xs">{SITE_TAGLINE}</p>
          <div className="flex gap-4">
            <Globe className="text-primary cursor-pointer hover:text-brand-yellow hover:-translate-y-1 transition-all" />
            <Github className="text-primary cursor-pointer hover:text-brand-yellow hover:-translate-y-1 transition-all" />
            <Share2 className="text-primary cursor-pointer hover:text-brand-yellow hover:-translate-y-1 transition-all" />
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-primary">Khám phá</h4>
          <ul className="space-y-2">
            {FOOTER_EXPLORE_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  className="text-on-surface-variant hover:text-brand-yellow transition-colors cursor-pointer"
                  to={to}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-primary">Hỗ trợ</h4>
          <ul className="space-y-2">
            {FOOTER_SUPPORT_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  className="text-on-surface-variant hover:text-brand-yellow transition-colors cursor-pointer"
                  to={to}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-primary">Văn phòng</h4>
          <p className="text-on-surface-variant">{SITE_ADDRESS}</p>
          <p className="text-on-surface-variant">Email: {SITE_EMAIL}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-12 pb-12">
        <div className="border-t border-outline-variant/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant text-xs">
            © {SITE_COPYRIGHT_YEAR} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs font-label uppercase tracking-widest text-on-surface-variant">
            <span>Tiếng Việt</span>
            <span>Hồ Chí Minh, Việt Nam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
