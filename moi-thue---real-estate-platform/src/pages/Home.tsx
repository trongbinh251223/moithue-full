import PageShell from '@/components/layout/PageShell';
import {
  HeroSection,
  FeaturesSection,
  ProfessionalServiceSection,
  CategoriesSection,
  BlogPreviewSection,
  NewsletterSection,
} from '@/sections/home';

export default function Home() {
  return (
    <PageShell className="bg-background selection:bg-primary/10">
      <HeroSection />
      <FeaturesSection />
      <ProfessionalServiceSection />
      <CategoriesSection />
      <BlogPreviewSection />
      <NewsletterSection />
    </PageShell>
  );
}
