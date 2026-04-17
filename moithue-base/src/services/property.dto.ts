import type { PropertyWithOwner } from '../repositories/property.repository';
import { parseImages } from '../repositories/property.repository';

function initialFromName(name: string): string {
  const t = name.trim();
  if (!t) return '?';
  return t[0]!.toUpperCase();
}

export function formatPriceMillionPerMonth(priceValue: number): string {
  if (Number.isInteger(priceValue)) return `${priceValue} triệu/tháng`;
  const s = String(priceValue).replace('.', ',');
  return `${s} triệu/tháng`;
}

export function toPropertyListingDto(p: PropertyWithOwner) {
  const images = parseImages(p.imagesJson);
  return {
    id: p.id,
    title: p.title,
    type: p.propertyType,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    project: p.project,
    priceDisplay: formatPriceMillionPerMonth(p.priceValue),
    priceValue: p.priceValue,
    area: `${p.areaValue} m²`,
    areaValue: p.areaValue,
    location: p.location,
    createdAt: p.createdAt,
    imageCount: images.length,
    image: images[0] ?? '',
    author: {
      name: p.ownerName,
      initial: initialFromName(p.ownerName),
      posts: p.ownerListingCount,
    },
  };
}

export function toPropertyDetailDto(p: PropertyWithOwner) {
  const images = parseImages(p.imagesJson);
  return {
    id: p.id,
    title: p.title,
    type: p.propertyType,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    floors: p.floors ?? 0,
    price: formatPriceMillionPerMonth(p.priceValue),
    priceValue: p.priceValue,
    deposit: p.depositText ?? '—',
    area: `${p.areaValue} m²`,
    areaValue: p.areaValue,
    location: p.location,
    locationExtra: p.locationExtra ?? '',
    description: p.description,
    phone: p.contactPhone ?? '—',
    images,
    project: p.project,
    status: p.status,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    owner: { name: p.ownerName, listingCount: p.ownerListingCount },
  };
}

export function toSimilarPropertyDto(p: PropertyWithOwner) {
  const images = parseImages(p.imagesJson);
  return {
    id: p.id,
    title: p.title,
    specs: `${p.bedrooms} PN · ${p.propertyType}`,
    price: formatPriceMillionPerMonth(p.priceValue),
    area: `${p.areaValue} m²`,
    location: p.location,
    locationExtra: p.locationExtra ?? '',
    createdAt: p.createdAt,
    imageCount: images.length,
    image: images[0] ?? '',
  };
}
