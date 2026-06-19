import SplitText from './SplitText.jsx';
import styles from './SectionHead.module.css';

export default function SectionHead({ zh, en }) {
  return (
    <div className={styles.head}>
      <SplitText as="div" className={styles.zh} text={zh} trigger="inView" />
      <div className={styles.en}>{en}</div>
      <div className={styles.line} />
    </div>
  );
}
