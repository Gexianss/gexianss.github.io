import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { prefersReducedMotion } from '../../hooks/useReducedMotion.js';
import styles from './PageReveal.module.css';

export default function PageReveal() {
  const [done, setDone] = useState(
    () => sessionStorage.getItem('revealed') === '1' || prefersReducedMotion(),
  );
  if (done) return null;
  return (
    <AnimatePresence>
      <motion.div
        className={styles.curtain}
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        transition={{ delay: 0.7, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => { sessionStorage.setItem('revealed', '1'); setDone(true); }}
      >
        <motion.div
          className={styles.stamp}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          張
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
