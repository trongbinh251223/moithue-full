import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AuthApiError, resetPasswordRequest } from '@/lib/authApi';
import { ROUTES } from '@/constants/routes';
import { resetPasswordFormSchema } from '@/validation/forms';
import type { z } from 'zod';

type ResetForm = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: '', confirm: '' },
  });

  const onSubmit = async (data: ResetForm) => {
    if (!token.trim()) {
      toast.error('Thiếu mã đặt lại mật khẩu. Hãy mở liên kết từ email hoặc từ bước quên mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      await resetPasswordRequest(token.trim(), data.password);
      toast.success('Mật khẩu đã được cập nhật.');
      navigate(ROUTES.login, { replace: true, state: { passwordResetOk: true } });
    } catch (err) {
      toast.error(err instanceof AuthApiError ? err.message : 'Không đặt lại được mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-sm border border-outline-variant/20 p-8 sm:p-12">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black tracking-tighter text-primary inline-block mb-6">
            Moi Thue
          </Link>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Đặt lại mật khẩu</h1>
          <p className="text-on-surface-variant text-sm">Nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        <p className="mb-4 text-xs text-on-surface-variant">
          Mật khẩu cần ít nhất 8 ký tự, gồm chữ cái và chữ số.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="reset-password">
              Mật khẩu mới
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              <input
                id="reset-password"
                type="password"
                placeholder="Mật khẩu mới"
                autoComplete="new-password"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                {...register('password')}
              />
            </div>
            {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password.message}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="reset-confirm">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              <input
                id="reset-confirm"
                type="password"
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                {...register('confirm')}
              />
            </div>
            {errors.confirm ? <p className="mt-1 text-sm text-red-600">{errors.confirm.message}</p> : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang lưu…' : 'Cập nhật mật khẩu'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <Link to={ROUTES.login} className="font-bold text-primary hover:underline">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
