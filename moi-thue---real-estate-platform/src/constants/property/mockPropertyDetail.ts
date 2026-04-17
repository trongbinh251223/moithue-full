import type { PropertyDetailViewModel, SimilarPropertyCard } from '@/types/property/propertyDetail.types';

export const MOCK_PROPERTY_DETAIL: PropertyDetailViewModel = {
  id: 'mock-detail',
  title: 'cho thuê nhà nguyên căn 6 tầng thang máy xây mới',
  type: 'Nhà ngõ, hẻm',
  bedrooms: 4,
  bathrooms: 5,
  price: '18 triệu/tháng',
  deposit: '18.000.000 đ/tháng',
  area: '35 m²',
  floors: 6,
  location: 'Ngách 32/65 An Dương, Phường Yên Phụ, Quận Tây Hồ, Hà Nội',
  locationExtra: '(Phường Hồng Hà, TP Hà Nội mới)',
  timePosted: 'Cập nhật 4 ngày trước',
  description: `Dự án:
Thông tin chi tiết: Mình có nhà nguyên căn xây mới 6 tầng thang máy.
4 phòng ngủ, 5 nhà vệ sinh.
Diện tích: 35m
Địa chỉ: An dương, đường thanh niên, tây hồ hà nội
Phù hợp với hộ gia đình hoặc kinh doanh cho thuê.
Giao thông thuận tiện, 2 phút ra đường thanh niên, lên phố cổ
Liên hệ mình chủ nhà nhé
***`,
  phone: '088611',
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600607687931-ce71171f1835?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600607687931-ce71171f1835?auto=format&fit=crop&q=80&w=1200',
  ],
};

export const MOCK_SIMILAR_PROPERTIES: SimilarPropertyCard[] = [
  {
    id: 'mock-sim-101',
    title: 'cần cho thuê nhà sân vườn 3 tầng 4 ngủ khu nghi tà...',
    specs: '4 PN · Nhà ngõ, hẻm',
    price: '17 triệu/tháng',
    area: '120 m²',
    location: 'Phường Yên Phụ',
    locationExtra: 'P. Hồng Hà mới',
    time: '6 ngày trước',
    imageCount: 8,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'mock-sim-102',
    title: 'Cho thuê nhà mới xây chưa ở',
    specs: '2 PN · Nhà ngõ, hẻm',
    price: '8 triệu/tháng',
    area: '30 m²',
    location: 'Phường Yên Phụ',
    locationExtra: 'P. Hồng Hà mới',
    time: '13 giờ trước',
    imageCount: 7,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1e525044c7?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'mock-sim-103',
    title: 'Sát Hồ Tây,nguyên căn, mới xây, 8 tầng thang máy',
    specs: '4 PN · Nhà biệt thự',
    price: '47,9 triệu/tháng',
    area: '36 m²',
    location: 'Phường Bưởi',
    locationExtra: 'P. Tây Hồ mới',
    time: '4 ngày trước',
    imageCount: 6,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'mock-sim-104',
    title: 'Chính chủ cho thuê nhà Nguyên căn 23 Xuân La. T...',
    specs: '7 PN · Nhà ngõ, hẻm',
    price: '28 triệu/tháng',
    area: '45 m²',
    location: 'Phường Xuân La',
    locationExtra: 'P. Tây Hồ mới',
    time: '3 ngày trước',
    imageCount: 5,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'mock-sim-105',
    title: 'Thuê nhà nguyên căn Thụy Khuê',
    specs: '2 PN · Nhà ngõ, hẻm',
    price: '6 triệu/tháng',
    area: '50 m²',
    location: 'Phường Bưởi',
    locationExtra: 'P. Tây Hồ mới',
    time: '2 ngày trước',
    imageCount: 8,
    image: 'https://images.unsplash.com/photo-1600607687931-ce71171f1835?auto=format&fit=crop&q=80&w=400',
  },
];
