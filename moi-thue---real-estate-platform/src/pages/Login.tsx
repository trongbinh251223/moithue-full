import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Facebook } from 'lucide-react';
import { toast } from 'sonner';
import { AuthApiError } from '@/lib/authApi';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { ROUTES } from '@/constants/routes';
import { loginFormSchema } from '@/validation/forms';
import type { z } from 'zod';

type LoginForm = z.infer<typeof loginFormSchema>;

export default function Login() {
  const { loginWithPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const resetOk = Boolean((location.state as { passwordResetOk?: boolean } | null)?.passwordResetOk);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      await loginWithPassword(data.email.trim(), data.password);
      toast.success('Đăng nhập thành công.');
      navigate(ROUTES.home);
    } catch (err) {
      toast.error(err instanceof AuthApiError ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = () => {
    toast.message('Đăng nhập mạng xã hội chưa được kết nối.', {
      description: 'Vui lòng dùng email và mật khẩu.',
    });
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-sm border border-outline-variant/20 p-8 sm:p-12">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            <Logo size="large" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Đăng nhập</h1>
          <p className="text-on-surface-variant text-sm">Chào mừng bạn quay trở lại!</p>
        </div>

        {resetOk ? (
          <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Mật khẩu đã được cập nhật. Bạn có thể đăng nhập bằng mật khẩu mới.
          </p>
        ) : null}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="login-email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              <input
                id="login-email"
                type="email"
                placeholder="Nhập email của bạn"
                autoComplete="email"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                {...register('email')}
              />
            </div>
            {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-on-surface" htmlFor="login-password">
                Mật khẩu
              </label>
              <Link to={ROUTES.forgotPassword} className="text-sm font-medium text-primary hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              <input
                id="login-password"
                type="password"
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                {...register('password')}
              />
            </div>
            {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password.message}</p> : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang xử lý…' : 'Đăng nhập'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-on-surface-variant">Hoặc đăng nhập bằng</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={handleSocialLogin}
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-outline-variant/40 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-medium text-sm text-on-surface">Google</span>
            </button>
            <button
              onClick={handleSocialLogin}
              type="button"
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-outline-variant/40 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <Facebook className="w-5 h-5 text-[#1877F2]" fill="#1877F2" />
              <span className="font-medium text-sm text-on-surface">Facebook</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-on-surface-variant">
          Chưa có tài khoản?{' '}
          <Link to={ROUTES.register} className="font-bold text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
