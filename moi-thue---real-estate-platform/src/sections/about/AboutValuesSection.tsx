import { ShieldCheck, Target, HeartHandshake } from 'lucide-react';

export default function AboutValuesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-on-surface mb-4">Giá trị cốt lõi</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto">
          Những nguyên tắc định hướng mọi hoạt động và quyết định của chúng tôi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-outline-variant/20 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-3">Minh bạch & An toàn</h3>
          <p className="text-on-surface-variant leading-relaxed">
            Mọi thông tin trên nền tảng đều được kiểm duyệt kỹ lưỡng, đảm bảo tính xác thực và an toàn cho cả người
            thuê lẫn người cho thuê.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-outline-variant/20 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-3">Hiệu quả tối đa</h3>
          <p className="text-on-surface-variant leading-relaxed">
            Ứng dụng công nghệ AI và thuật toán tìm kiếm thông minh giúp kết nối đúng nhu cầu trong thời gian ngắn
            nhất.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-outline-variant/20 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartHandshake className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-on-surface mb-3">Đồng hành tận tâm</h3>
          <p className="text-on-surface-variant leading-relaxed">
            Đội ngũ hỗ trợ luôn sẵn sàng lắng nghe và giải quyết mọi vấn đề của khách hàng 24/7 với thái độ chuyên
            nghiệp nhất.
          </p>
        </div>
      </div>
    </section>
  );
}
