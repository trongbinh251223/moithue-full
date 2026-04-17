import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/apiClient';
import type { PropertySimilarListingDto } from '@/types/property/propertyDetail.types';
import { formatRelativeVi } from '@/utils/formatRelativeVi';
import type { PropertyListing } from '@/types/property/property.types';

export type PropertyListingDto = {
  id: string;
  title: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  project: string | null;
  priceDisplay: string;
  priceValue: number;
  area: string;
  areaValue: number;
  location: string;
  createdAt: string;
  imageCount: number;
  image: string;
  author: { name: string; initial: string; posts: number };
  isSaved?: boolean;
};

export function mapListingDtoToUi(row: PropertyListingDto): PropertyListing {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    project: row.project,
    priceDisplay: row.priceDisplay,
    priceValue: row.priceValue,
    area: row.area,
    areaValue: row.areaValue,
    location: row.location,
    timePosted: formatRelativeVi(row.createdAt),
    timestamp: new Date(row.createdAt).getTime(),
    imageCount: row.imageCount,
    image: row.image,
    author: row.author,
    isSaved: row.isSaved ?? false,
  };
}

export async function fetchPropertySearch(
  query: string,
  token?: string | null,
): Promise<{
  data: PropertyListingDto[];
  meta: { page: number; limit: number; total: number; offset: number };
}> {
  const res = await apiGet<{
    data: PropertyListingDto[];
    meta: { page: number; limit: number; total: number; offset: number };
  }>(`/properties?${query}`, token ? { token } : undefined);
  return res;
}

export type PropertyDetailDto = {
  id: string;
  title: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  price: string;
  priceValue: number;
  deposit: string;
  area: string;
  areaValue: number;
  location: string;
  locationExtra: string;
  description: string;
  phone: string;
  images: string[];
  project: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  owner: { name: string; listingCount: number };
  isSaved?: boolean;
};

export async function fetchPropertyDetail(id: string, token?: string | null) {
  return apiGet<{ data: PropertyDetailDto }>(`/properties/${id}`, { token });
}

export async function fetchSimilarProperties(id: string) {
  return apiGet<{ data: PropertySimilarListingDto[] }>(`/properties/${id}/similar`);
}

export type ManageRentalRow = PropertyListingDto & {
  status: string;
  depositText?: string | null;
  description?: string;
};

export async function fetchMyProperties(
  status: 'active' | 'pending' | 'rejected' | undefined,
  page: number,
  token: string,
  limit = 100,
) {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) q.set('status', status);
  return apiGet<{ data: ManageRentalRow[]; meta: { total: number } }>(`/properties/me?${q}`, { token });
}

export async function deleteProperty(id: string, token: string) {
  await apiDelete(`/properties/${id}`, { token });
}

export type PropertyCreatePayload = {
  title: string;
  propertyType: string;
  project?: string | null;
  bedrooms: number;
  bathrooms: number;
  floors?: number | null;
  areaValue: number;
  priceValue: number;
  depositText?: string | null;
  location: string;
  locationExtra?: string | null;
  description: string;
  contactPhone?: string | null;
  images: string[];
};

export async function createProperty(payload: PropertyCreatePayload, token: string) {
  return apiPost<{ data: PropertyDetailDto }>('/properties', payload, { token });
}

export async function addSavedProperty(propertyId: string, token: string) {
  await apiPost<{ ok: true }>('/users/me/saved-properties', { propertyId }, { token });
}

export async function removeSavedProperty(propertyId: string, token: string) {
  await apiDelete(`/users/me/saved-properties/${propertyId}`, { token });
}

export async function clearAllSavedProperties(token: string) {
  await apiDelete('/users/me/saved-properties', { token });
}

export async function fetchSavedProperties(page: number, token: string, limit = 20) {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiGet<{
    data: PropertyListingDto[];
    meta: { page: number; limit: number; total: number; offset: number };
  }>(`/users/me/saved-properties?${q}`, { token });
}
