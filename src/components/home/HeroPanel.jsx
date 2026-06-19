import { useTranslation } from 'react-i18next';
import SplitText from '../common/SplitText.jsx';
import styles from './HeroPanel.module.css';

export default function HeroPanel() {
  const { t } = useTranslation();
  return (
    <section className={`panel ${styles.hero}`}>
      <div className={`rv ${styles.greet}`}>{t('hero.greet')}</div>
      <h1 className={styles.name}>
        <SplitText as="span" text={t('hero.name')} trigger="mount" delay={0.1} />
        <span className={styles.dot}>。</span>
      </h1>
      <SplitText as="div" className={styles.enName} text={t('hero.enName')} trigger="mount" delay={0.3} />
      <div className={`rv ${styles.role}`}>{t('hero.role')}</div>
      <div className={styles.motto}>{t('hero.motto')}</div>
    </section>
  );
}
