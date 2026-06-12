import { useTranslation } from 'react-i18next';
import styles from './HeroPanel.module.css';

export default function HeroPanel() {
  const { t } = useTranslation();
  return (
    <section className={`panel ${styles.hero}`}>
      <div className={`rv ${styles.greet}`}>{t('hero.greet')}</div>
      <h1 className={`rv ${styles.name}`}>{t('hero.name')}<span className={styles.dot}>。</span></h1>
      <div className={`rv ${styles.enName}`}>{t('hero.enName')}</div>
      <div className={`rv ${styles.role}`}>{t('hero.role')}</div>
      <div className={styles.motto}>{t('hero.motto')}</div>
    </section>
  );
}
