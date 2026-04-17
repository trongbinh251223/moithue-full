import { motion } from 'motion/react';
import { HOME_FEATURES } from '@/constants/home/features';

export default function FeaturesSection() {
  return (
    <section className="bg-surface-container-low py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOME_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-[2rem] hover:bg-primary transition-all group shadow-sm hover:shadow-xl cursor-pointer"
            >
              <feature.icon className="w-10 h-10 text-primary mb-6 group-hover:text-white transition-colors" />
              <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="text-sm text-on-surface-variant group-hover:text-white/80 leading-relaxed transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
