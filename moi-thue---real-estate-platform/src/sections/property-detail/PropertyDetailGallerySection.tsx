import { ChevronRight, ChevronLeft, Share2, MoreVertical } from 'lucide-react';
import type { PropertyDetailViewModel } from '@/types/property/propertyDetail.types';

interface PropertyDetailGallerySectionProps {
  property: PropertyDetailViewModel;
  currentImageIndex: number;
  onSelectImage: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function PropertyDetailGallerySection({
  property,
  currentImageIndex,
  onSelectImage,
  onPrev,
  onNext,
}: PropertyDetailGallerySectionProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-4 mb-6">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-black group">
        <img
          src={property.images[currentImageIndex]}
          alt=""
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />

        <div className="absolute top-4 right-4 flex gap-2">
          <button
            type="button"
            className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-on-surface shadow-sm transition-colors cursor-pointer"
            aria-label="Chia sẻ"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-on-surface shadow-sm transition-colors cursor-pointer"
            aria-label="Thêm"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          type="button"
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          aria-label="Ảnh sau"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
          {currentImageIndex + 1} / {property.images.length}
        </div>
      </div>

      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 custom-scrollbar">
        {property.images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectImage(idx)}
            className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
              currentImageIndex === idx ? 'border-primary' : 'border-transparent'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            {currentImageIndex !== idx && (
              <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
