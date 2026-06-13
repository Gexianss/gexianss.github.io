import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './useReducedMotion.js';

const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

// trackRef: 橫向軌道；barRef: 進度條；glowRef: 視差光暈層（0.3×）
export function useHorizontalScroll({ trackRef, barRef, glowRef }) {
  const targetRef = useRef(0);

  // 導航用：滑到指定元素
  const scrollToEl = (el) => {
    if (!el) return;
    if (isMobile()) {
      el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    targetRef.current = Math.max(0, el.offsetLeft - window.innerWidth * 0.04);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let current = 0;
    let raf;
    const reduced = prefersReducedMotion();
    const max = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const onWheel = (e) => {
      if (isMobile()) return;
      targetRef.current = Math.min(max(), Math.max(0, targetRef.current + e.deltaY));
    };
    const onKey = (e) => {
      if (isMobile()) return;
      if (e.key === 'ArrowRight')
        targetRef.current = Math.min(max(), targetRef.current + window.innerWidth * 0.9);
      if (e.key === 'ArrowLeft')
        targetRef.current = Math.max(0, targetRef.current - window.innerWidth * 0.9);
    };

    const tick = () => {
      if (!isMobile()) {
        current += (targetRef.current - current) * (reduced ? 1 : 0.075);
        track.style.transform = `translateX(${-current}px)`;
        if (glowRef.current) glowRef.current.style.transform = `translateX(${-current * 0.3}px)`;
        if (barRef.current) barRef.current.style.width = `${max() ? (current / max()) * 100 : 0}%`;
        for (const p of track.children) {
          const mid = p.offsetLeft + p.offsetWidth / 2 - current;
          p.classList.toggle(
            'active',
            mid > -window.innerWidth * 0.2 && mid < window.innerWidth * 1.1,
          );
        }
      }
      raf = requestAnimationFrame(tick);
    };

    addEventListener('wheel', onWheel, { passive: true });
    addEventListener('keydown', onKey);
    raf = requestAnimationFrame(tick);
    return () => {
      removeEventListener('wheel', onWheel);
      removeEventListener('keydown', onKey);
      cancelAnimationFrame(raf);
    };
  }, [trackRef, barRef, glowRef]);

  return { scrollToEl };
}
