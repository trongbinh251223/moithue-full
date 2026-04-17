import { Heart, MapPin, Clock } from 'lucide-react';
import type { PropertyDetailViewModel } from '@/types/property/propertyDetail.types';

interface PropertyDetailSummarySectionProps {
  property: PropertyDetailViewModel;
  isSaved: boolean;
  onToggleSaved: () => void;
}

export default function PropertyDetailSummarySection({
  property,
  isSaved,
  onToggleSaved,
}: PropertyDetailSummarySectionProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-6 sm:p-8 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface mb-2 leading-tight">{property.title}</h1>
          <div className="text-on-surface-variant text-sm mb-4">
            {property.bedrooms} PN • {property.type}
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-2xl sm:text-3xl font-bold text-[#e03c31]">{property.price}</span>
            <span className="text-lg font-medium text-on-surface">{property.area}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleSaved}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full border font-medium transition-all cursor-pointer flex-shrink-0 ${
            isSaved
              ? 'border-[#e03c31] text-[#e03c31] bg-[#e03c31]/5'
              : 'border-outline-variant/40 hover:border-[#e03c31] hover:text-[#e03c31]'
          }`}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#e03c31]' : ''}`} />
          Lưu
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 text-on-surface-variant">
          <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-on-surface">{property.location}</p>
            <p className="text-sm">{property.locationExtra}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-on-surface-variant">
          <Clock className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{property.timePosted}</span>
        </div>
      </div>
    </section>
  );
}
