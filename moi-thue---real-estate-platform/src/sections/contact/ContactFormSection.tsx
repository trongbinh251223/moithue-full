import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { contactFormSchema } from '@/validation/forms';
import type { z } from 'zod';
import { submitContactMessage } from '@/lib/contactApi';
import { ApiError } from '@/lib/apiClient';

type ContactForm = z.infer<typeof contactFormSchema>;

export default function ContactFormSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', phone: '', email: '', topic: '', message: '' },
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      await submitContactMessage({
        name: data.name,
        phone: data.phone,
        email: data.email,
        topic: data.topic,
        message: data.message,
      });
      toast.success('Đã ghi nhận tin nhắn. Chúng tôi sẽ phản hồi sớm nhất có thể.');
      reset();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Gửi tin nhắn thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/20 p-8 sm:p-10">
      <h3 className="text-2xl font-bold text-on-surface mb-8">Gửi tin nhắn</h3>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="contact-name">
              Họ và tên
            </label>
            <input
              id="contact-name"
              type="text"
              placeholder="Nhập họ tên của bạn"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              {...register('name')}
            />
            {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name.message}</p> : null}
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="contact-phone">
              Số điện thoại
            </label>
            <input
              id="contact-phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              {...register('phone')}
            />
            {errors.phone ? <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p> : null}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="Nhập địa chỉ email"
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            {...register('email')}
          />
          {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="contact-topic">
            Chủ đề
          </label>
          <select
            id="contact-topic"
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
            {...register('topic')}
          >
            <option value="">Chọn chủ đề cần hỗ trợ</option>
            <option value="support">Hỗ trợ kỹ thuật</option>
            <option value="billing">Thanh toán & Gói cước</option>
            <option value="partnership">Hợp tác kinh doanh</option>
            <option value="other">Khác</option>
          </select>
          {errors.topic ? <p className="mt-1 text-sm text-red-600">{errors.topic.message}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="contact-message">
            Nội dung tin nhắn
          </label>
          <textarea
            id="contact-message"
            rows={4}
            placeholder="Nhập nội dung chi tiết..."
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            {...register('message')}
          />
          {errors.message ? <p className="mt-1 text-sm text-red-600">{errors.message.message}</p> : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          Gửi tin nhắn
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
