import type { PropertyDetailDto } from '@/lib/propertiesApi';
import type {
  PropertyDetailViewModel,
  PropertySimilarListingDto,
  SimilarPropertyCard,
} from '@/types/property/propertyDetail.types';
import { formatRelativeVi } from '@/utils/formatRelativeVi';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';

export function mapPropertyDetailDtoToViewModel(d: PropertyDetailDto): PropertyDetailViewModel {
  return {
    id: d.id,
    title: d.title,
    type: d.type,
    bedrooms: d.bedrooms,
    bathrooms: d.bathrooms,
    price: d.price,
    deposit: d.deposit,
    area: d.area,
    floors: d.floors,
    location: d.location,
    locationExtra: d.locationExtra,
    timePosted: formatRelativeVi(d.createdAt),
    description: d.description,
    phone: d.phone,
    images: d.images.length ? d.images : [PLACEHOLDER_IMAGE],
  };
}

export function mapSimilarListingToCard(s: PropertySimilarListingDto): SimilarPropertyCard {
  return {
    id: s.id,
    title: s.title,
    specs: s.specs,
    price: s.price,
    area: s.area,
    location: s.location,
    locationExtra: s.locationExtra,
    time: formatRelativeVi(s.createdAt),
    imageCount: s.imageCount,
    image: s.image,
  };
}
