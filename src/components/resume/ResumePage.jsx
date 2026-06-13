import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import FixedUI from '../layout/FixedUI.jsx';
import SectionHead from '../common/SectionHead.jsx';
import styles from './ResumePage.module.css';

export default function ResumePage() {
  const { t } = useTranslation();
  const jobs = t('resume.jobs', { returnObjects: true });
  const skillGroups = t('resume.skillGroups', { returnObjects: true });
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
        <h1 className={styles.name}>
          {t('resume.title')}
          <span className={styles.dot}>。</span>
        </h1>
        <p className={styles.subtitle}>{t('resume.subtitle')}</p>
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
