import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AuthApiError, forgotPasswordRequest } from '@/lib/authApi';
import { ROUTES } from '@/constants/routes';
import { forgotPasswordFormSchema } from '@/validation/forms';
import type { z } from 'zod';

type ForgotForm = z.infer<typeof forgotPasswordFormSchema>;

export default function ForgotPassword() {
  const [done, setDone] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true);
    try {
      const res = await forgotPasswordRequest(data.email.trim());
      setMessage(res.message);
      setResetUrl(res.resetUrl ?? null);
      setDone(true);
      toast.success('Đã gửi hướng dẫn tới email của bạn (nếu tài khoản tồn tại).');
    } catch (err) {
      toast.error(err instanceof AuthApiError ? err.message : 'Không gửi được yêu cầu.');
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
          <h1 className="text-2xl font-bold text-on-surface mb-2">Quên mật khẩu</h1>
          <p className="text-on-surface-variant text-sm">Nhập email của bạn để nhận liên kết đặt lại mật khẩu</p>
        </div>

        {done && message ? (
          <div className="mb-6 space-y-4 rounded-xl border border-outline-variant/30 bg-surface-container-low px-4 py-4 text-sm text-on-surface">
            <p>{message}</p>
            {resetUrl ? (
              <div className="space-y-2">
                <p className="font-medium text-on-surface-variant">
                  Môi trường dev: API đã trả về liên kết đặt lại (khi Worker có cấu hình PASSWORD_RESET_APP_URL).
                </p>
                <Link
                  to={(() => {
                    try {
                      const u = new URL(resetUrl);
                      return `${u.pathname}${u.search}`;
                    } catch {
                      return ROUTES.resetPassword;
                    }
                  })()}
                  className="block break-all text-primary font-bold hover:underline"
                >
                  Mở trang đặt lại mật khẩu
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        {!done ? (
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="forgot-email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  {...register('email')}
                />
              </div>
              {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang gửi…' : 'Gửi liên kết'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <Link
            to={ROUTES.login}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant/40 py-3.5 text-sm font-bold text-on-surface hover:bg-surface-container-low"
          >
            Về trang đăng nhập
          </Link>
        )}

        <div className="mt-8 text-center">
          <Link
            to={ROUTES.login}
            className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
