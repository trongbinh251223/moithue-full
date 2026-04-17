import PageShell from '@/components/layout/PageShell';
import { AboutHeroSection, AboutStatsSection, AboutValuesSection } from '@/sections/about';

export default function About() {
  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12">
      <AboutHeroSection />
      <AboutStatsSection />
      <AboutValuesSection />
    </PageShell>
  );
}
