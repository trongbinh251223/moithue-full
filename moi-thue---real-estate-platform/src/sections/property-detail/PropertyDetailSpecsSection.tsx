import { Home, Maximize, Bed, Bath, Banknote, Layers } from 'lucide-react';
import type { PropertyDetailViewModel } from '@/types/property/propertyDetail.types';

interface PropertyDetailSpecsSectionProps {
  property: PropertyDetailViewModel;
}

export default function PropertyDetailSpecsSection({ property }: PropertyDetailSpecsSectionProps) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-6 sm:p-8 mb-6">
      <h2 className="text-xl font-bold text-on-surface mb-6">Đặc điểm bất động sản</h2>
      <div className="bg-surface-container-low rounded-xl p-0 overflow-hidden border border-outline-variant/20">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="flex items-center p-4 border-b sm:border-r border-outline-variant/20">
            <Home className="w-5 h-5 text-on-surface-variant mr-3" />
            <span className="text-on-surface-variant w-32">Loại hình</span>
            <span className="font-medium text-on-surface">{property.type}</span>
          </div>
          <div className="flex items-center p-4 border-b border-outline-variant/20">
            <Maximize className="w-5 h-5 text-on-surface-variant mr-3" />
            <span className="text-on-surface-variant w-32">Diện tích đất</span>
            <span className="font-medium text-on-surface">{property.area}</span>
          </div>
          <div className="flex items-center p-4 border-b sm:border-r border-outline-variant/20">
            <Bed className="w-5 h-5 text-on-surface-variant mr-3" />
            <span className="text-on-surface-variant w-32">Số phòng ngủ</span>
            <span className="font-medium text-on-surface">{property.bedrooms} phòng</span>
          </div>
          <div className="flex items-center p-4 border-b border-outline-variant/20">
            <Bath className="w-5 h-5 text-on-surface-variant mr-3" />
            <span className="text-on-surface-variant w-32">Số phòng vệ sinh</span>
            <span className="font-medium text-on-surface">{property.bathrooms} phòng</span>
          </div>
          <div className="flex items-center p-4 border-b sm:border-b-0 sm:border-r border-outline-variant/20">
            <Banknote className="w-5 h-5 text-on-surface-variant mr-3" />
            <span className="text-on-surface-variant w-32">Số tiền cọc</span>
            <span className="font-medium text-on-surface">{property.deposit}</span>
          </div>
          <div className="flex items-center p-4">
            <Layers className="w-5 h-5 text-on-surface-variant mr-3" />
            <span className="text-on-surface-variant w-32">Tổng số tầng</span>
            <span className="font-medium text-on-surface">{property.floors}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
