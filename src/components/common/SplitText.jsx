import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../../hooks/useReducedMotion.js';

// 標題逐字登場（framer-motion stagger）。trigger: 'mount' 立即播 / 'inView' 進視口才播。
// reduced-motion 時直接顯示完成態。CJK 用 Array.from 正確切字。
const container = {
  hidden: {},
  show: (delay = 0) => ({ transition: { staggerChildren: 0.04, delayChildren: delay } }),
};
const child = {
  hidden: { opacity: 0, y: '0.5em' },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function SplitText({ text, as = 'span', className, trigger = 'inView', delay = 0 }) {
  if (prefersReducedMotion()) {
    const Plain = as;
    return <Plain className={className}>{text}</Plain>;
  }
  const Tag = motion[as] || motion.span;
  const triggerProps =
    trigger === 'mount'
      ? { initial: 'hidden', animate: 'show' }
      : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-10% 0px' } };
  return (
    <Tag className={className} variants={container} custom={delay} aria-label={text} {...triggerProps}>
      {Array.from(text).map((c, i) => (
        <motion.span
          key={i}
          variants={child}
          aria-hidden="true"
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {c}
        </motion.span>
      ))}
    </Tag>
  );
}
