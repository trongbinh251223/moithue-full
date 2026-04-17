import PageShell from '@/components/layout/PageShell';
import {
  ContactFormSection,
  ContactInfoSection,
  ContactPageIntroSection,
} from '@/sections/contact';

export default function Contact() {
  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
      <ContactPageIntroSection />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <ContactInfoSection />
        <ContactFormSection />
      </div>
    </PageShell>
  );
}
