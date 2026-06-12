import { forwardRef } from 'react';
import styles from './GlowLayer.module.css';

// 6 顆光暈鋪滿約 400vw 的軌道長度，視差移動由 useHorizontalScroll 控制
const GLOWS = [
  { size: 340, left: '52vw', bottom: '-130px' },
  { size: 200, left: '70vw', top: '-70px' },
  { size: 130, left: '10vw', bottom: '4vh' },
  { size: 300, left: '150vw', top: '10vh' },
  { size: 240, left: '230vw', bottom: '-80px' },
  { size: 320, left: '330vw', top: '-60px' },
];

const GlowLayer = forwardRef(function GlowLayer(_, ref) {
  return (
    <div className={styles.layer} ref={ref} aria-hidden="true">
      {GLOWS.map((g, i) => (
        <div
          key={i}
          className={`${styles.circle} ${styles[`c${(i % 3) + 1}`]}`}
          style={{ width: g.size, height: g.size, left: g.left, top: g.top, bottom: g.bottom }}
        />
      ))}
    </div>
  );
});
export default GlowLayer;
