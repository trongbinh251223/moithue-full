import type { LucideIcon } from 'lucide-react';

export interface HomeFeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface HomeCategoryItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface HeroGalleryImage {
  src: string;
  alt: string;
  /** CSS grid placement classes */
  gridClass: string;
  motionDelay?: number;
}
