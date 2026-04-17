import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PageShell from '@/components/layout/PageShell';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { createProperty, type PropertyCreatePayload } from '@/lib/propertiesApi';
import { ApiError } from '@/lib/apiClient';
import { adminPropertyFormSchema, parseAdminPropertyImages } from '@/validation/forms';
import type { z } from 'zod';

const PROPERTY_TYPE_OPTIONS = [
  'Căn hộ chung cư',
  'Nhà biệt thự',
  'Nhà mặt phố',
  'Phòng trọ',
  'Căn hộ mini',
  'Nhà nguyên căn',
] as const;

const DEMO_IMAGE =
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200';

type AdminForm = z.infer<typeof adminPropertyFormSchema>;

export default function AdminPostProperty() {
  const navigate = useNavigate();
  const { accessToken, user, isAuthenticated } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminForm>({
    resolver: zodResolver(adminPropertyFormSchema),
    defaultValues: {
      title: '',
      propertyType: PROPERTY_TYPE_OPTIONS[0],
      project: '',
      floors: '',
      bedrooms: '2',
      bathrooms: '2',
      areaValue: '70',
      priceValue: '15',
      depositText: '',
      location: '',
      locationExtra: '',
      description: '',
      contactPhone: '',
      imagesRaw: DEMO_IMAGE,
    },
  });

  if (!isAuthenticated || !accessToken) {
    return (
      <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-2xl mx-auto px-4">
        <p className="text-center text-on-surface-variant">
          Vui lòng{' '}
          <Link to={ROUTES.login} className="font-bold text-primary">
            đăng nhập
          </Link>{' '}
          (tài khoản quản trị) để đăng tin.
        </p>
      </PageShell>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-2xl mx-auto px-4">
        <p className="text-center text-on-surface-variant mb-4">Chỉ quản trị viên mới có thể đăng tin mới.</p>
        <Link to={ROUTES.search} className="block text-center font-bold text-primary">
          Về trang chủ
        </Link>
      </PageShell>
    );
  }

  const onSubmit = async (data: AdminForm) => {
    const imgParsed = parseAdminPropertyImages(data.imagesRaw, DEMO_IMAGE);
    if (!imgParsed.success) {
      toast.error(imgParsed.error.issues[0]?.message ?? 'Danh sách ảnh không hợp lệ.');
      return;
    }
    const fl = data.floors.trim() === '' ? null : Number.parseInt(data.floors, 10);
    const b = Number.parseInt(data.bedrooms, 10);
    const ba = Number.parseInt(data.bathrooms, 10);
    const area = Number.parseFloat(data.areaValue);
    const price = Number.parseFloat(data.priceValue);
    const payload: PropertyCreatePayload = {
      title: data.title.trim(),
      propertyType: data.propertyType.trim(),
      project: data.project.trim() || null,
      bedrooms: Number.isFinite(b) ? b : 0,
      bathrooms: Number.isFinite(ba) ? ba : 0,
      floors: fl !== null && Number.isFinite(fl) ? fl : null,
      areaValue: Number.isFinite(area) ? area : 0,
      priceValue: Number.isFinite(price) ? price : 0,
      depositText: data.depositText.trim() || null,
      location: data.location.trim(),
      locationExtra: data.locationExtra.trim() || null,
      description: data.description.trim(),
      contactPhone: data.contactPhone.trim() || null,
      images: imgParsed.data,
    };

    try {
      const res = await createProperty(payload, accessToken);
      toast.success('Đã đăng tin.');
      navigate(ROUTES.propertyDetail(res.data.id));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Đăng tin thất bại.');
    }
  };

  const fieldClass =
    'w-full rounded-xl border border-outline-variant/30 px-4 py-2.5 text-on-surface bg-white focus:outline-none focus:ring-2 focus:ring-primary/30';

  return (
    <PageShell className="bg-surface" mainClassName="pt-28 pb-16 max-w-3xl mx-auto px-4 sm:px-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Đăng tin mới (admin)</h1>
        <Link to={ROUTES.manageRentals} className="text-sm font-medium text-primary hover:underline">
          ← Quản lý tin đăng
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-2xl border border-outline-variant/20 p-6 sm:p-8 shadow-sm" noValidate>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-on-surface">Tiêu đề</span>
          <input className={fieldClass} {...register('title')} />
          {errors.title ? <p className="text-sm text-red-600">{errors.title.message}</p> : null}
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-on-surface">Loại hình</span>
          <select className={fieldClass} {...register('propertyType')}>
            {PROPERTY_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.propertyType ? <p className="text-sm text-red-600">{errors.propertyType.message}</p> : null}
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-on-surface">Dự án / khu (tuỳ chọn)</span>
          <input className={fieldClass} {...register('project')} />
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-on-surface">PN</span>
            <input className={fieldClass} inputMode="numeric" {...register('bedrooms')} />
            {errors.bedrooms ? <p className="text-sm text-red-600">{errors.bedrooms.message}</p> : null}
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-on-surface">WC</span>
            <input className={fieldClass} inputMode="numeric" {...register('bathrooms')} />
            {errors.bathrooms ? <p className="text-sm text-red-600">{errors.bathrooms.message}</p> : null}
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-on-surface">Tầng</span>
            <input className={fieldClass} inputMode="numeric" placeholder="—" {...register('floors')} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-on-surface">Diện tích (m²)</span>
            <input className={fieldClass} inputMode="decimal" {...register('areaValue')} />
            {errors.areaValue ? <p className="text-sm text-red-600">{errors.areaValue.message}</p> : null}
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-on-surface">Giá (triệu/tháng)</span>
            <input className={fieldClass} inputMode="decimal" {...register('priceValue')} />
            {errors.priceValue ? <p className="text-sm text-red-600">{errors.priceValue.message}</p> : null}
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-on-surface">Cọc (mô tả)</span>
            <input className={fieldClass} {...register('depositText')} placeholder="VD: 30 triệu" />
          </label>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-on-surface">Địa chỉ hiển thị</span>
          <input className={fieldClass} {...register('location')} />
          {errors.location ? <p className="text-sm text-red-600">{errors.location.message}</p> : null}
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-on-surface">Khu vực thêm (tuỳ chọn)</span>
          <input className={fieldClass} {...register('locationExtra')} />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-on-surface">Mô tả</span>
          <textarea className={`${fieldClass} min-h-[140px] resize-y`} {...register('description')} />
          {errors.description ? <p className="text-sm text-red-600">{errors.description.message}</p> : null}
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-on-surface">SĐT liên hệ</span>
          <input className={fieldClass} {...register('contactPhone')} />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-on-surface">Ảnh (mỗi dòng một URL)</span>
          <textarea className={`${fieldClass} min-h-[100px] font-mono text-xs`} {...register('imagesRaw')} />
          {errors.imagesRaw ? <p className="text-sm text-red-600">{errors.imagesRaw.message}</p> : null}
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Đang gửi…' : 'Đăng tin'}
        </button>
      </form>
    </PageShell>
  );
}
