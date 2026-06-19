import styles from './GradualBlur.module.css';

// 邊緣漸層模糊：純 CSS（backdrop-filter + mask 漸層），讓內容向邊緣柔化淡出。
export default function GradualBlur({ side = 'left', size = '6vw' }) {
  const dim = side === 'bottom' ? { height: size } : { width: size };
  return <div className={`${styles.blur} ${styles[side]}`} style={dim} aria-hidden="true" />;
}
