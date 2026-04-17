import { Search, BookOpen } from 'lucide-react';

export default function GuidePageHeaderSection() {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
        <BookOpen className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-on-surface mb-4">Hướng dẫn sử dụng</h1>
      <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
        Tìm hiểu cách sử dụng Moi Thue hiệu quả nhất. Chúng tôi luôn ở đây để hỗ trợ bạn.
      </p>

      <div className="max-w-xl mx-auto mt-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
        <input
          type="search"
          placeholder="Bạn cần tìm hướng dẫn gì?"
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-outline-variant/40 bg-white shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-base"
        />
      </div>
    </div>
  );
}
