import PageShell from '@/components/layout/PageShell';
import { GuidePageHeaderSection, GuideTopicGridSection } from '@/sections/guide';

export default function Guide() {
  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
      <GuidePageHeaderSection />
      <GuideTopicGridSection />
    </PageShell>
  );
}
