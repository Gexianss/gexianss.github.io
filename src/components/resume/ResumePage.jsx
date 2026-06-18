import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import FixedUI from '../layout/FixedUI.jsx';
import SectionHead from '../common/SectionHead.jsx';
import styles from './ResumePage.module.css';

const PDF_FILENAME = { zh: '張溦珊-履歷.pdf', en: 'Chang-Wei-Shan-Resume.pdf' };

export default function ResumePage() {
  const { t, i18n } = useTranslation();
  const jobs = t('resume.jobs', { returnObjects: true });
  const skillGroups = t('resume.skillGroups', { returnObjects: true });
  const lang = i18n.language === 'en' ? 'en' : 'zh';
  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <FixedUI />
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.name}>
            {t('resume.title')}
            <span className={styles.dot}>。</span>
          </h1>
          <a
            className={styles.download}
            href={`${import.meta.env.BASE_URL}resume-${lang}.pdf`}
            download={PDF_FILENAME[lang]}
          >
            ↓ {t('resume.download')}
          </a>
        </div>
        <p className={styles.subtitle}>{t('resume.subtitle')}</p>
        <div className={styles.contact}>
          <a href={`mailto:${t('contact.email')}`}>{t('contact.email')}</a>
          <a href="https://github.com/Gexianss" target="_blank" rel="noreferrer">
            {t('contact.github')}
          </a>
        </div>
        <p className={styles.summary}>{t('resume.summary')}</p>
      </header>

      <SectionHead zh={t('resume.zh')} en="Experience" />
      <div className={styles.timeline}>
        {jobs.map((job) => (
          <article key={job.company} className={styles.job}>
            <div className={styles.period}>{job.period}</div>
            <div>
              <h2 className={styles.jobTitle}>{job.title}</h2>
              <div className={styles.company}>{job.company}</div>
              <ul className={styles.points}>
                {job.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <SectionHead zh="技能" en="Skills" />
      <table className={styles.skills}>
        <tbody>
          {skillGroups.map((g) => (
            <tr key={g.name}>
              <th>{g.name}</th>
              <td>{g.items}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.main>
  );
}
