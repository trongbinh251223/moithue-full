import { ChevronLeft, ChevronRight, Heart, MapPin, Image as ImageIcon } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import type { SimilarPropertyCard } from '@/types/property/propertyDetail.types';

interface PropertyDetailSimilarSectionProps {
  properties: SimilarPropertyCard[];
}

export default function PropertyDetailSimilarSection({ properties }: PropertyDetailSimilarSectionProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-6 sm:p-8 mb-8">
      <h2 className="text-xl font-bold text-on-surface mb-6">Tin đăng tương tự</h2>
      <div className="relative group/slider">
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView="auto"
          navigation={{
            nextEl: '.similar-next',
            prevEl: '.similar-prev',
          }}
          className="!pb-2"
        >
          {properties.map((prop) => (
            <SwiperSlide key={prop.id} className="!w-[220px] sm:!w-[240px] flex flex-col cursor-pointer group">
              <div className="relative h-[160px] rounded-xl overflow-hidden mb-3">
                <img
                  src={prop.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                <button
                  type="button"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-10"
                  aria-label="Lưu tin"
                >
                  <Heart className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 text-white text-[11px] font-medium z-10">{prop.time}</div>
                <div className="absolute bottom-2 right-2 text-white text-[11px] font-medium flex items-center gap-1 z-10">
                  {prop.imageCount} <ImageIcon className="w-3 h-3" />
                </div>
              </div>

              <h3 className="text-[15px] font-semibold text-on-surface line-clamp-2 mb-1.5 group-hover:text-primary transition-colors leading-snug">
                {prop.title}
              </h3>
              <div className="text-[13px] text-on-surface-variant mb-2">{prop.specs}</div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-base font-bold text-[#e03c31]">{prop.price}</span>
                <span className="text-[13px] font-medium text-on-surface">{prop.area}</span>
              </div>
              <div className="flex items-start gap-1.5 text-[13px] text-on-surface-variant mt-auto">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{prop.location}</span>
                  <span className="text-[11px] truncate">{prop.locationExtra}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          type="button"
          className="similar-prev absolute left-0 top-[80px] -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center border border-outline-variant/20 hover:bg-surface-container-low transition-colors z-10 opacity-0 group-hover/slider:opacity-100 hidden sm:flex cursor-pointer disabled:opacity-0 disabled:cursor-default"
          aria-label="Trước"
        >
          <ChevronLeft className="w-5 h-5 text-on-surface" />
        </button>
        <button
          type="button"
          className="similar-next absolute right-0 top-[80px] -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center border border-outline-variant/20 hover:bg-surface-container-low transition-colors z-10 opacity-0 group-hover/slider:opacity-100 hidden sm:flex cursor-pointer disabled:opacity-0 disabled:cursor-default"
          aria-label="Sau"
        >
          <ChevronRight className="w-5 h-5 text-on-surface" />
        </button>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          className="w-full sm:w-auto sm:min-w-[300px] px-8 py-2.5 rounded-full border border-outline-variant/40 font-bold text-sm text-on-surface hover:bg-surface-container-low hover:border-outline-variant transition-colors cursor-pointer"
        >
          Xem thêm
        </button>
      </div>
    </section>
  );
}
