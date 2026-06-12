import styles from './SectionHead.module.css';

export default function SectionHead({ zh, en }) {
  return (
    <div className={styles.head}>
      <div className={styles.zh}>{zh}</div>
      <div className={styles.en}>{en}</div>
      <div className={styles.line} />
    </div>
  );
}
