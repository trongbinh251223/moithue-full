import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import PageShell from '@/components/layout/PageShell';
import UserSidebar from '@/components/layout/UserSidebar';
import { User, Mail, Phone, MapPin, ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { patchMeProfile } from '@/lib/userApi';
import { ApiError } from '@/lib/apiClient';
import { profileFormSchema } from '@/validation/forms';
import type { z } from 'zod';

type ProfileForm = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { user, accessToken, updateSessionUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      avatar: '',
      address: '',
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      name: user.name ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      avatar: user.avatar ?? '',
      address: user.address ?? '',
    });
  }, [user, reset]);

  const onSubmit = async (data: ProfileForm) => {
    if (!accessToken) {
      toast.error('Bạn cần đăng nhập.');
      return;
    }
    try {
      const updated = await patchMeProfile(
        {
          name: data.name.trim(),
          email: data.email.trim(),
          phone: data.phone.trim() === '' ? null : data.phone.trim(),
          avatar: data.avatar.trim() === '' ? null : data.avatar.trim(),
          address: data.address.trim() === '' ? null : data.address.trim(),
        },
        accessToken,
      );
      updateSessionUser(updated);
      reset({
        name: updated.name ?? '',
        email: updated.email ?? '',
        phone: updated.phone ?? '',
        avatar: updated.avatar ?? '',
        address: updated.address ?? '',
      });
      toast.success('Đã lưu thông tin tài khoản.');
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Không lưu được thông tin.');
    }
  };

  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        <UserSidebar />

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-on-surface mb-8">Thông tin cá nhân</h1>

          <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/20 p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-outline-variant/20">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-primary" />
                )}
              </div>
              <div className="text-center sm:text-left w-full max-w-md">
                <h2 className="text-2xl font-bold text-on-surface mb-2">{user?.name || 'Người dùng'}</h2>
                <p className="text-on-surface-variant flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  {user?.email || '—'}
                </p>
                {user?.phone ? (
                  <p className="text-on-surface-variant flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <Phone className="w-4 h-4 shrink-0" />
                    {user.phone}
                  </p>
                ) : null}
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="profile-name">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                    <input
                      id="profile-name"
                      type="text"
                      autoComplete="name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      {...register('name')}
                    />
                  </div>
                  {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name.message}</p> : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="profile-email">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                    <input
                      id="profile-email"
                      type="email"
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      {...register('email')}
                    />
                  </div>
                  {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="profile-phone">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                  <input
                    id="profile-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Chưa cập nhật"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    {...register('phone')}
                  />
                </div>
                {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="profile-avatar">
                  Ảnh đại diện (URL)
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                  <input
                    id="profile-avatar"
                    type="url"
                    placeholder="https://..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    {...register('avatar')}
                  />
                </div>
                {errors.avatar ? <p className="mt-1 text-sm text-red-600">{errors.avatar.message}</p> : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="profile-address">
                  Địa chỉ
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                  <input
                    id="profile-address"
                    type="text"
                    autoComplete="street-address"
                    placeholder="Chưa cập nhật"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    {...register('address')}
                  />
                </div>
                {errors.address ? <p className="mt-1 text-sm text-red-600">{errors.address.message}</p> : null}
              </div>

              <div className="pt-6 border-t border-outline-variant/20 flex justify-end gap-4">
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl font-medium text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                  onClick={() => user && reset({
                    name: user.name ?? '',
                    email: user.email ?? '',
                    phone: user.phone ?? '',
                    avatar: user.avatar ?? '',
                    address: user.address ?? '',
                  })}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Đang lưu…' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
