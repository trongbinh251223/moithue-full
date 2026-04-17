import { GUIDE_PAGE_TOPIC_GROUPS } from '@/constants/guide/pageData';

export default function GuideTopicGridSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {GUIDE_PAGE_TOPIC_GROUPS.map((section, index) => {
        const Icon = section.icon;
        return (
          <div
            key={section.title}
            className="bg-white rounded-[32px] p-8 border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-on-surface">{section.title}</h2>
            </div>
            <ul className="space-y-4">
              {section.items.map((item, i) => (
                <li key={`${index}-${i}`}>
                  <span className="flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors group cursor-pointer">
                    <span className="w-1.5 h-1.5 rounded-full bg-outline-variant group-hover:bg-primary transition-colors" />
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
