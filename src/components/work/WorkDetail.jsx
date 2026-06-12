import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import FixedUI from '../layout/FixedUI.jsx';
import Tag from '../common/Tag.jsx';
import { works } from '../../data/works.js';
import styles from './WorkDetail.module.css';

export default function WorkDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const idx = works.findIndex((w) => w.slug === slug);
  if (idx === -1) return <Navigate to="/" replace />;
  const work = works[idx];
  const prev = works[(idx - 1 + works.length) % works.length];
  const next = works[(idx + 1) % works.length];

  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <FixedUI />
      <Link to="/" className={styles.back}>{t('works.back')}</Link>
      <div className={styles.label}>{t(`works.${slug}.label`)}</div>
      <h1 className={styles.title}>{t(`works.${slug}.title`)}</h1>
      <div className={styles.meta}>{work.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
      <div className={styles.thumb}><span>{work.glyph}</span></div>
      <div className={styles.body}>
        <p>{t(`works.${slug}.desc`)}</p>
        <p>{t(`works.${slug}.detail`)}</p>
      </div>
      {work.github && (
        <a className={styles.gh} href={work.github} target="_blank" rel="noreferrer">GitHub ↗</a>
      )}
      <Link to={`/works/${prev.slug}`} className={`${styles.pager} ${styles.prev}`}>{t('works.prev')}</Link>
      <Link to={`/works/${next.slug}`} className={`${styles.pager} ${styles.next}`}>{t('works.next')}</Link>
    </motion.main>
  );
}
