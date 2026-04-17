export default function AboutHeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24 text-center">
      <h1 className="text-4xl sm:text-5xl font-black text-on-surface mb-6 leading-tight">
        Kết nối không gian sống <br className="hidden sm:block" />
        <span className="text-primary">Lý tưởng cho người Việt</span>
      </h1>
      <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
        Moi Thue được sinh ra với sứ mệnh làm cho việc tìm kiếm và cho thuê bất động sản trở nên minh bạch, dễ
        dàng và an toàn hơn bao giờ hết.
      </p>
      <div className="w-full h-[400px] sm:h-[500px] rounded-[32px] overflow-hidden bg-surface-container-low">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200"
          alt="Moi Thue Office"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
}
