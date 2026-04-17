import { useState } from 'react';
import { Phone, ChevronDown } from 'lucide-react';
import type { PropertyDetailViewModel } from '@/types/property/propertyDetail.types';

interface PropertyDetailDescriptionSectionProps {
  property: PropertyDetailViewModel;
}

export default function PropertyDetailDescriptionSection({
  property,
}: PropertyDetailDescriptionSectionProps) {
  const [showPhone, setShowPhone] = useState(false);

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-6 sm:p-8 mb-8">
      <h2 className="text-xl font-bold text-on-surface mb-6">Mô tả chi tiết</h2>
      <div className="text-on-surface whitespace-pre-line leading-relaxed mb-6">{property.description}</div>

      <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl inline-flex mb-4">
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-primary" />
          <span className="font-bold text-on-surface">SĐT Liên hệ:</span>
        </div>
        <span className="text-lg font-bold text-on-surface tracking-wider">
          {showPhone ? `${property.phone} 888` : `${property.phone} ***`}
        </span>
        {!showPhone && (
          <button
            type="button"
            onClick={() => setShowPhone(true)}
            className="text-primary font-bold text-sm hover:underline cursor-pointer ml-2"
          >
            Hiện SĐT
          </button>
        )}
      </div>

      <div className="text-center mt-4">
        <button
          type="button"
          className="text-on-surface-variant hover:text-primary font-medium text-sm flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
        >
          Xem thêm <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
