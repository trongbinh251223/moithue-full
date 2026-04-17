import type { HeroGalleryImage } from '@/types/content/homeContent.types';

export const HERO_DISTRICT_OPTIONS = [
  'Quận / Huyện',
  'Quận 1',
  'Quận 3',
  'Bình Thạnh',
] as const;

export const HERO_PROPERTY_GROUP_OPTIONS = [
  'Nhóm Nguồn Hàng',
  'Phòng khép kín',
  'Nhà nguyên căn',
  'Văn phòng',
] as const;

export const HERO_TREND_KEYWORDS = [
  'Kim Giang',
  'Ngọc Hồi',
  'Nguyễn Định Công',
  'Cầu Diễn',
  'Hoài Đức',
] as const;

export const HERO_GALLERY_IMAGES: HeroGalleryImage[] = [
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoNdmAaIiY5aOTgLFCCz0Tltusae4PlQtr-ajfh74eQbbcotUnsasJDdlxLtzATduJUHXUkH14EFTR7PPbFELHn5Or_TCJAure4knEBoIeur_QT0qo7mGIcM9Klc83oW4KpWx-92u5HZZ9BO33QIdZaRhhe16_L1W23JkR8sB9IhTFsr7rCaAcOPFO-V9TqOee6EOykx8XwQauL7hEpwEp7moHxLw5f9ZlyanXFnGRrMNmRbf7mEIeSPvjodyHd6ntPjPYrulYoFYM',
    alt: 'Modern apartment',
    gridClass: 'col-start-1 col-span-5 row-start-2 row-span-7 rounded-card overflow-hidden shadow-lg',
    motionDelay: 0,
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG__gZ3yngJWJdRr0CDbiTV8azIwBsV8PHRTRnzd5PYBPuQ1gJQNXSrtF8lwG91JdMeHN0lL64NDUP9lMvwcYpj77HFznRFJ1wtA2CQZ8H-Ia2Kfs10NOINw4czYBdoYyY57zgAR85iJVL7rN8uzBz9gZ1mq4K5r0BejOWZuGxdQoOJIC0LMJM_lNVz12A0ZITu3ijnfBF5dj6r4OMxfeo5CTbYlxMWws3FinBNtE1QnvsGpnGR24GZvOCd9PEL-w6EZHfdz_dLDVO',
    alt: 'Bedroom',
    gridClass: 'col-start-6 col-span-4 row-start-1 row-span-4 rounded-card overflow-hidden shadow-lg',
    motionDelay: 0.1,
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLuXePfllmqGn42JgDpML-gV6vCc6NqfAHrktr-GnEBw18fBn-jvgQFlmvnyspYSwJB7leLZRpj83IjKrnuh2sx2KZMQleaOhq_XKi10ZesjHFUvqeh_ImWdmq17rs5ReecM4mr1GB1xiEPDlpY8hlJzXwFs9BypiUJnHgnD5urRpaxascI_D6zwcP6npCgeaVYTRTmMYEav2WaEiVKO_cNRmib0zgy-letE5rkB2xEPenX-tC7xHEiTFPE6IhM6-f13L7s0zhtHEA',
    alt: 'Kitchen',
    gridClass: 'col-start-10 col-span-3 row-start-1 row-span-3 rounded-card overflow-hidden shadow-lg',
    motionDelay: 0.2,
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX31HFF4aWVVJtNuN36pfApmmp9TsPWTmdHfyQUG2wDzmdq0btncCqFV1LG5fZRHd7_-r_Vfg3YOYPCrpHmLO7YPSmskMtNF0nAO0FZTUtA90pPH_HzUqiF5EgvYzcfYzmChVstDnzp5hO2QHnGA4O-ruLsu6P8UhIDjrFiL4KxwW-uMdfm0La_8g332TmQ_nQppjK7iRoILKV5bIg_zszBIjFJ9F3QSPI1SnXYkJop_5gVIYH9pvILlTb-e55CjgtR5DddU31qGWf',
    alt: 'Living room',
    gridClass: 'col-start-6 col-span-7 row-start-5 row-span-5 rounded-card overflow-hidden shadow-lg',
    motionDelay: 0.3,
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG1Qow7E2AFDwDFfyHW5JCsU63pJb_WtC5IUFAHnY05HYJWDXt7qRoyGRksuqF2heP6-1wBwlBASwKK6I9RFCO13avNIIkD81KkDdKfP5JAN5G-aWH273KyHSQwTQcRIn-iLT-Q834i6MOIHyYTupyilEq_XLZgykOFfrnYqbUtnSB-WcO-bTpsMyROIXjW7QAbCvy7fWH4197y532EdYmOVT1_3PfPX39Hyhyr_QPpUs6t63hRTQKhwCYd-9VknDJ4HtNrdlaObot',
    alt: 'Architecture',
    gridClass: 'col-start-1 col-span-6 row-start-9 row-span-4 rounded-card overflow-hidden shadow-lg',
    motionDelay: 0.4,
  },
  {
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVKp3eYntDgpxaBJ-_RglERvZp2mB3hSG-rq_k3bX82XCqFpIi3rkBge1tq-AIjon-IzY8XiODlMeU49ev5SDctWI1aqQHob81QcO0V7MvUXzZKSaS2sYDy9f4WiXCL-WY7Auke2fZmlYQbwR8HDVK7N3hvQvO2uJgf1c_NzmcsQ2JUlQO3esoPT8AAgD5DdxRaYAfV-zJYa3_gLlACER-IIerm8am83vvLiRCqFvqTGUK4PWMNo3BkbPSCVWdTpZxUbDqdg31PPuQ',
    alt: 'Office',
    gridClass: 'col-start-7 col-span-6 row-start-10 row-span-3 rounded-card overflow-hidden shadow-lg',
    motionDelay: 0.5,
  },
];
