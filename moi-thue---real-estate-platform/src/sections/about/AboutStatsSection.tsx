export default function AboutStatsSection() {
  return (
    <section className="bg-primary text-white py-16 mb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-black mb-2">50K+</div>
            <div className="text-white/80 font-medium">Tin đăng mỗi tháng</div>
          </div>
          <div>
            <div className="text-4xl font-black mb-2">2M+</div>
            <div className="text-white/80 font-medium">Người dùng truy cập</div>
          </div>
          <div>
            <div className="text-4xl font-black mb-2">63</div>
            <div className="text-white/80 font-medium">Tỉnh thành phủ sóng</div>
          </div>
          <div>
            <div className="text-4xl font-black mb-2">98%</div>
            <div className="text-white/80 font-medium">Khách hàng hài lòng</div>
          </div>
        </div>
      </div>
    </section>
  );
}
