import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AuthApiError } from '@/lib/authApi';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';
import { registerFormSchema } from '@/validation/forms';
import type { z } from 'zod';

type RegisterForm = z.infer<typeof registerFormSchema>;

export default function Register() {
  const { registerWithPassword } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await registerWithPassword(data.name.trim(), data.email.trim(), data.password);
      toast.success('Đăng ký thành công.');
      navigate(ROUTES.home);
    } catch (err) {
      toast.error(err instanceof AuthApiError ? err.message : 'Đăng ký thất bại.');
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
          <h1 className="text-2xl font-bold text-on-surface mb-2">Đăng ký tài khoản</h1>
          <p className="text-on-surface-variant text-sm">Tạo tài khoản để bắt đầu tìm kiếm nhà</p>
        </div>

        <p className="mb-4 text-xs text-on-surface-variant">
          Mật khẩu cần ít nhất 8 ký tự, gồm chữ cái và chữ số.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="reg-name">
              Họ và tên
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              <input
                id="reg-name"
                type="text"
                placeholder="Nhập họ và tên"
                autoComplete="name"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                {...register('name')}
              />
            </div>
            {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name.message}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="reg-email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              <input
                id="reg-email"
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
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="reg-password">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              <input
                id="reg-password"
                type="password"
                placeholder="Tạo mật khẩu"
                autoComplete="new-password"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                {...register('password')}
              />
            </div>
            {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password.message}</p> : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5" htmlFor="reg-confirm">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              <input
                id="reg-confirm"
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
            {loading ? 'Đang xử lý…' : 'Đăng ký'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-on-surface-variant">
          Đã có tài khoản?{' '}
          <Link to={ROUTES.login} className="font-bold text-primary hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
