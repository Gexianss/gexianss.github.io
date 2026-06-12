import { useTranslation } from 'react-i18next';
import SectionHead from '../common/SectionHead.jsx';
import styles from './AboutPanel.module.css';

export default function AboutPanel() {
  const { t } = useTranslation();
  const keywords = t('about.keywords', { returnObjects: true });
  return (
    <section className={`panel ${styles.about}`}>
      <div className="rv"><SectionHead zh={t('about.zh')} en={t('about.en')} /></div>
      <div className={`rv ${styles.grid}`}>
        <p className={styles.text}>{t('about.text')}</p>
        <div className={styles.kw}>
          {keywords.map((k) => <span key={k}>{k}</span>)}
        </div>
      </div>
    </section>
  );
}
