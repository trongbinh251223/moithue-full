import { z } from 'zod';

/** Khớp rule backend: ≥8, có chữ cái và chữ số. */
export const passwordFieldSchema = z
  .string()
  .min(8, 'Mật khẩu cần ít nhất 8 ký tự')
  .max(128, 'Mật khẩu quá dài')
  .regex(/[A-Za-z]/, 'Mật khẩu cần có ít nhất một chữ cái')
  .regex(/[0-9]/, 'Mật khẩu cần có ít nhất một chữ số');

export const loginFormSchema = z.object({
  email: z.string().min(1, 'Nhập email').email('Email không hợp lệ'),
  password: z.string().min(1, 'Nhập mật khẩu'),
});

export const registerFormSchema = z
  .object({
    name: z.string().min(1, 'Nhập họ và tên').max(256, 'Tên quá dài'),
    email: z.string().min(1, 'Nhập email').email('Email không hợp lệ'),
    password: passwordFieldSchema,
    confirm: z.string().min(1, 'Xác nhận mật khẩu'),
  })
  .refine((d) => d.password === d.confirm, { message: 'Hai lần nhập mật khẩu không khớp', path: ['confirm'] });

export const forgotPasswordFormSchema = z.object({
  email: z.string().min(1, 'Nhập email').email('Email không hợp lệ'),
});

export const resetPasswordFormSchema = z
  .object({
    password: passwordFieldSchema,
    confirm: z.string().min(1, 'Xác nhận mật khẩu'),
  })
  .refine((d) => d.password === d.confirm, { message: 'Hai lần nhập mật khẩu không khớp', path: ['confirm'] });

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Nhập mật khẩu hiện tại'),
    newPassword: passwordFieldSchema,
    confirm: z.string().min(1, 'Xác nhận mật khẩu mới'),
  })
  .refine((d) => d.newPassword === d.confirm, {
    message: 'Mật khẩu mới và xác nhận không khớp',
    path: ['confirm'],
  });

export const profileFormSchema = z.object({
  name: z.string().min(1, 'Nhập họ và tên').max(256, 'Tên quá dài'),
  email: z.string().min(1, 'Nhập email').email('Email không hợp lệ'),
  phone: z
    .string()
    .max(32, 'Số điện thoại quá dài')
    .regex(/^[0-9+\s().-]*$/, 'Số điện thoại không hợp lệ'),
  avatar: z.union([z.literal(''), z.string().url('URL ảnh không hợp lệ').max(2048)]),
  address: z.string().max(512, 'Địa chỉ quá dài'),
});

const imageUrl = z.string().url('Mỗi URL ảnh phải hợp lệ').max(2048);

export const adminPropertyFormSchema = z.object({
  title: z.string().min(3, 'Tiêu đề ít nhất 3 ký tự').max(512, 'Tiêu đề quá dài'),
  propertyType: z.string().min(1, 'Chọn loại hình').max(128),
  project: z.string().max(256),
  floors: z.string(),
  bedrooms: z.string().regex(/^[0-9]+$/, 'Nhập số phòng ngủ'),
  bathrooms: z.string().regex(/^[0-9]+$/, 'Nhập số WC'),
  areaValue: z.string().regex(/^[0-9]+(\.[0-9]+)?$/, 'Nhập diện tích hợp lệ'),
  priceValue: z.string().regex(/^[0-9]+(\.[0-9]+)?$/, 'Nhập giá hợp lệ'),
  depositText: z.string().max(256),
  location: z.string().min(1, 'Nhập địa chỉ').max(512),
  locationExtra: z.string().max(256),
  description: z.string().min(10, 'Mô tả ít nhất 10 ký tự').max(20000),
  contactPhone: z.string().max(64),
  imagesRaw: z.string().min(1, 'Thêm ít nhất một URL ảnh'),
});

export function parseAdminPropertyImages(imagesRaw: string, fallbackUrl: string) {
  const lines = imagesRaw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const urls = lines.length > 0 ? lines : [fallbackUrl];
  return z.array(imageUrl).min(1).max(30).safeParse(urls);
}

export const verifyEmailCodeSchema = z.string().length(6, 'Nhập đủ 6 chữ số').regex(/^\d+$/, 'Mã chỉ gồm chữ số');

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Nhập họ và tên').max(128),
  phone: z.string().min(8, 'Nhập số điện thoại hợp lệ').max(32).regex(/^[0-9+\s().-]+$/, 'Số điện thoại không hợp lệ'),
  email: z.string().min(1, 'Nhập email').email('Email không hợp lệ'),
  topic: z.string().min(1, 'Chọn chủ đề'),
  message: z.string().min(10, 'Nội dung ít nhất 10 ký tự').max(5000),
});
