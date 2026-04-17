import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { NEWSLETTER_SIDE_IMAGE } from '@/constants/home/newsletter';
import { Input } from '@/components/ui/Input';

export default function NewsletterSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 mb-16 lg:mb-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-primary rounded-[3rem] p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center overflow-hidden relative shadow-2xl shadow-primary/20"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="z-10 space-y-8">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Đăng kí nhận bản tin</h2>
          <p className="text-white/80 max-w-md text-lg">
            Nhận ngay những tin đăng mới nhất và ưu đãi độc quyền từ cộng đồng Moi Thue qua email hàng tuần.
          </p>
          <div className="relative max-w-md group">
            <Input
              className="w-full bg-white/10 border border-transparent rounded-2xl py-5 px-6 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/30 cursor-text"
              placeholder="Địa chỉ email của bạn"
              type="email"
            />
            <button
              type="button"
              className="absolute right-2 top-2 bottom-2 bg-white text-primary w-12 h-12 rounded-xl flex items-center justify-center hover:bg-brand-yellow hover:text-white hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
              aria-label="Đăng ký"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="relative z-10 hidden lg:block">
          <motion.img
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-[2rem] w-full aspect-video object-cover shadow-2xl"
            src={NEWSLETTER_SIDE_IMAGE}
            alt=""
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>
    </section>
  );
}
