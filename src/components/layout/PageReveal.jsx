import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { prefersReducedMotion } from '../../hooks/useReducedMotion.js';
import { works } from '../../data/works.js';
import styles from './PageReveal.module.css';

const MIN_DISPLAY = 400; // 最少顯示，避免快取命中時閃一下
const MAX_WAIT = 4000; // 上限，網路再慢也不卡死

// 開場簾幕：停在畫面上「直到字型與作品縮圖載好」（或逾時），再掀開進主畫面。
// 不用 sessionStorage——以資源是否就緒為準，所以重新整理/慢網路時一樣會等。
export default function PageReveal() {
  const reduced = prefersReducedMotion();
  const [done, setDone] = useState(reduced);
  const [lift, setLift] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    const start = performance.now();

    const imgs = works
      .filter((w) => w.thumb)
      .map(
        (w) =>
          new Promise((res) => {
            const img = new Image();
            img.onload = img.onerror = res;
            img.src = w.thumb;
          }),
      );
    const ready = Promise.all([document.fonts.ready, ...imgs]);
    const timeout = new Promise((res) => setTimeout(res, MAX_WAIT));

    Promise.race([ready, timeout]).then(() => {
      if (cancelled) return;
      const wait = Math.max(0, MIN_DISPLAY - (performance.now() - start));
      setTimeout(() => !cancelled && setLift(true), wait);
    });

    return () => {
      cancelled = true;
    };
  }, [reduced]);

  if (done) return null;
  return (
    <AnimatePresence>
      <motion.div
        className={styles.curtain}
        data-curtain=""
        initial={{ y: 0 }}
        animate={{ y: lift ? '-100%' : 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        onAnimationComplete={() => lift && setDone(true)}
      >
        <div className={styles.inner}>
          <motion.div
            className={styles.stamp}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
          >
            張
          </motion.div>
          <div className={styles.loader} aria-hidden="true" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
