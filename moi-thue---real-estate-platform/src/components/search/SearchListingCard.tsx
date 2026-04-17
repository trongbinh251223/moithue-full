import type { MouseEvent as ReactMouseEvent } from 'react';
import { motion } from 'motion/react';
import { Heart, Image as ImageIcon, MapPin } from 'lucide-react';
import type { PropertyListing } from '@/types/property/property.types';

type Props = {
  property: PropertyListing;
  onOpenDetail: (id: string) => void;
  onToggleSaved: (e: ReactMouseEvent, id: string) => void;
};

export function SearchListingCard({ property, onOpenDetail, onToggleSaved }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={() => onOpenDetail(property.id)}
      className="group flex flex-col sm:flex-row bg-white rounded-2xl overflow-hidden border border-outline-variant/20 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
    >
      <div className="sm:w-[280px] h-[200px] sm:h-auto relative overflow-hidden flex-shrink-0 p-3">
        <div className="w-full h-full relative rounded-xl overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md">
            {property.timePosted}
          </div>
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
            {property.imageCount} <ImageIcon className="w-3 h-3" />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-on-surface leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {property.title}
          </h3>
          <div className="text-sm text-on-surface-variant mb-3">
            {property.bedrooms} PN · {property.bathrooms} WC · {property.type}
          </div>

          <div className="flex items-baseline gap-4 mb-3">
            <span className="text-xl font-bold text-[#e03c31]">{property.priceDisplay}</span>
            <span className="text-base font-medium text-on-surface">{property.area}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-on-surface-variant mb-4">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-yellow flex items-center justify-center text-white font-bold text-sm">
              {property.author.initial}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-on-surface">{property.author.name}</span>
              <span className="text-on-surface-variant text-xs px-2 py-0.5 bg-surface-container-low rounded-full">
                {property.author.posts} tin đăng
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => onToggleSaved(e, property.id)}
            className={`p-2 rounded-full transition-colors cursor-pointer
                ${property.isSaved ? 'text-[#e03c31] bg-[#e03c31]/10' : 'text-on-surface-variant hover:text-[#e03c31] hover:bg-[#e03c31]/10'}`}
          >
            <Heart className={`w-5 h-5 ${property.isSaved ? 'fill-[#e03c31]' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
