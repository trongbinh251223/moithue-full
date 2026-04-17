import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { HOME_RENT_CATEGORIES } from '@/constants/home/categories';

export default function CategoriesSection() {
  return (
    <section className="bg-surface-container-low py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight">Chọn loại nhà thuê bạn đang quan tâm</h2>
          <p className="text-on-surface-variant">Đa dạng lựa chọn phù hợp với mọi nhu cầu và ngân sách</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {HOME_RENT_CATEGORIES.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[2.5rem] border border-outline-variant/10 hover:shadow-xl hover:border-primary/20 transition-all group cursor-pointer"
            >
              <div className="w-14 h-14 bg-surface-container-low rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <category.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{category.title}</h3>
              <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">{category.description}</p>
              <Link
                className="text-primary font-bold text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                to={ROUTES.search}
              >
                Chi tiết <span className="text-lg">→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
