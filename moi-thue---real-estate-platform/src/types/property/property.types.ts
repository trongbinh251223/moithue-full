export interface PropertyAuthor {
  name: string;
  initial: string;
  posts: number;
}

export interface PropertyListing {
  id: string;
  title: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  project: string | null;
  priceDisplay: string;
  /** Monthly rent in millions (VND) */
  priceValue: number;
  area: string;
  areaValue: number;
  location: string;
  timePosted: string;
  timestamp: number;
  imageCount: number;
  image: string;
  author: PropertyAuthor;
  /** Yêu thích (đồng bộ server khi đã đăng nhập) */
  isSaved?: boolean;
}
