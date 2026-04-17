import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import {
  PROFESSIONAL_SERVICE_BULLETS,
  PROFESSIONAL_SERVICE_IMAGE,
} from '@/constants/home/professionalService';

export default function ProfessionalServiceSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <img
            className="w-full aspect-[4/5] object-cover"
            src={PROFESSIONAL_SERVICE_IMAGE}
            alt="Consultant"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute -bottom-8 -right-8 bg-primary text-white p-8 rounded-[2rem] shadow-xl text-center"
        >
          <p className="text-4xl font-black mb-1">30+</p>
          <p className="text-xs uppercase tracking-widest font-label opacity-80">Thành viên</p>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        <span className="inline-block px-5 py-2 bg-secondary/10 text-secondary rounded-full font-label text-xs font-bold uppercase tracking-widest">
          Dịch vụ chuyên nghiệp
        </span>
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
          Như thế nào là một nhà cố vấn cho thuê chuyên nghiệp?
        </h2>
        <p className="text-on-surface-variant leading-relaxed text-lg">
          Moi Thue không chỉ cung cấp nền tảng tìm kiếm, chúng tôi đóng vai trò là người cố vấn, giúp bạn sàng
          lọc rủi ro và tối ưu hóa ngân sách thuê nhà.
        </p>
        <ul className="space-y-4">
          {PROFESSIONAL_SERVICE_BULLETS.map((item) => (
            <li key={item} className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="text-primary w-4 h-4" />
              </div>
              <span className="font-medium">{item}</span>
            </li>
          ))}
        </ul>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98, y: 0 }}
          className="px-10 py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg hover:shadow-primary/30 cursor-pointer"
        >
          Khám phá ngay
        </motion.button>
      </motion.div>
    </section>
  );
}
