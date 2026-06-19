import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../hooks/useReducedMotion.js';

// 滾動進場：元素進視口時 opacity + 上移升入（once）。reduced-motion 時直接顯示。
export default function Reveal({ children, as = 'div', className, delay = 0, y = 28 }) {
  if (prefersReducedMotion()) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </Tag>
  );
}
