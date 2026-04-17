/** Bản ghi API `/properties/:id/similar` (map sang `SimilarPropertyCard`). */
export interface PropertySimilarListingDto {
  id: string;
  title: string;
  specs: string;
  price: string;
  area: string;
  location: string;
  locationExtra: string;
  createdAt: string;
  imageCount: number;
  image: string;
}

export interface PropertyDetailViewModel {
  id: string;
  title: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  deposit: string;
  area: string;
  floors: number;
  location: string;
  locationExtra: string;
  timePosted: string;
  description: string;
  phone: string;
  images: string[];
}

export interface SimilarPropertyCard {
  id: string;
  title: string;
  specs: string;
  price: string;
  area: string;
  location: string;
  locationExtra: string;
  /** Hiển thị thời gian đăng (tương đối). */
  time: string;
  imageCount: number;
  image: string;
}
