import { useTranslation } from 'react-i18next';
import SectionHead from '../common/SectionHead.jsx';
import styles from './ContactPanel.module.css';

export default function ContactPanel({ id }) {
  const { t } = useTranslation();
  return (
    <section id={id} className={`panel ${styles.contact}`}>
      <div className="rv"><SectionHead zh={t('contact.zh')} en={t('contact.en')} /></div>
      <p className={`rv ${styles.line}`}>{t('contact.line')}<span className={styles.dot}>。</span></p>
      <div className={`rv ${styles.links}`}>
        <a href={`mailto:${t('contact.email')}`}>{t('contact.email')}</a>
        <a href="https://github.com/Gexianss" target="_blank" rel="noreferrer">{t('contact.github')}</a>
      </div>
    </section>
  );
}
