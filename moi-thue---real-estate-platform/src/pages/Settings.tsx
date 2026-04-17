import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import PageShell from '@/components/layout/PageShell';
import UserSidebar from '@/components/layout/UserSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { changePassword } from '@/lib/userApi';
import { ApiError } from '@/lib/apiClient';
import { changePasswordFormSchema } from '@/validation/forms';
import type { z } from 'zod';

type PasswordForm = z.infer<typeof changePasswordFormSchema>;

export default function Settings() {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirm: '' },
  });

  const onSubmit = async (data: PasswordForm) => {
    if (!accessToken) {
      toast.error('Bạn cần đăng nhập.');
      return;
    }
    setLoading(true);
    try {
      await changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword }, accessToken);
      toast.success('Đã đổi mật khẩu thành công.');
      reset();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Đổi mật khẩu thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        <UserSidebar />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-on-surface mb-8">Cài đặt tài khoản</h1>
          <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/20 p-8 max-w-lg">
            <h2 className="text-lg font-bold text-on-surface mb-2">Đổi mật khẩu</h2>
            <p className="text-on-surface-variant text-sm mb-6">
              Mật khẩu mới cần ít nhất 8 ký tự, gồm chữ cái và chữ số.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="pwd-current">
                  Mật khẩu hiện tại
                </label>
                <input
                  id="pwd-current"
                  type="password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none"
                  {...register('currentPassword')}
                />
                {errors.currentPassword ? (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                ) : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="pwd-new">
                  Mật khẩu mới
                </label>
                <input
                  id="pwd-new"
                  type="password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none"
                  {...register('newPassword')}
                />
                {errors.newPassword ? <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p> : null}
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1" htmlFor="pwd-confirm">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  id="pwd-confirm"
                  type="password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none"
                  {...register('confirm')}
                />
                {errors.confirm ? <p className="mt-1 text-sm text-red-600">{errors.confirm.message}</p> : null}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Đang lưu…' : 'Cập nhật mật khẩu'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
