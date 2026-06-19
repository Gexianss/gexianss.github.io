import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import FixedUI from '../layout/FixedUI.jsx';
import Tag from '../common/Tag.jsx';
import Reveal from '../common/Reveal.jsx';
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <FixedUI />
      <Link to="/" className={styles.back}>
        {t('works.back')}
      </Link>
      <Reveal className={styles.label}>{t(`works.${slug}.label`)}</Reveal>
      <Reveal as="h1" className={styles.title} delay={0.05}>
        {t(`works.${slug}.title`)}
      </Reveal>
      <Reveal className={styles.meta} delay={0.1}>
        {work.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </Reveal>
      <Reveal className={styles.thumb} delay={0.15}>
        {work.thumb ? (
          <img className={styles.img} src={work.thumb} alt={t(`works.${slug}.title`)} />
        ) : (
          <span className={styles.ph}>{work.glyph}</span>
        )}
      </Reveal>
      <Reveal as="div" className={styles.body}>
        <p>{t(`works.${slug}.desc`)}</p>
        <p>{t(`works.${slug}.detail`)}</p>
      </Reveal>
      {work.github && (
        <a className={styles.gh} href={work.github} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      )}
      <Link
        to={`/works/${prev.slug}`}
        className={`${styles.pager} ${styles.prev}`}
        aria-label={t('works.prev')}
      >
        <span className={styles.pagerPanel} aria-hidden="true" />
        <span className={styles.lab}>
          <span className={styles.pagerTxt}>{t('works.prev')}</span>
          <span className={styles.pagerLine} aria-hidden="true" />
        </span>
      </Link>
      <Link
        to={`/works/${next.slug}`}
        className={`${styles.pager} ${styles.next}`}
        aria-label={t('works.next')}
      >
        <span className={styles.pagerPanel} aria-hidden="true" />
        <span className={styles.lab}>
          <span className={styles.pagerTxt}>{t('works.next')}</span>
          <span className={styles.pagerLine} aria-hidden="true" />
        </span>
      </Link>
    </motion.main>
  );
}
