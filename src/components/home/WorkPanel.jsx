import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Tag from '../common/Tag.jsx';
import styles from './WorkPanel.module.css';

export default function WorkPanel({ work, id }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section
      id={id}
      className={`panel ${styles.work}`}
      onClick={() => navigate(`/works/${work.slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/works/${work.slug}`)}
    >
      <div className={styles.row}>
        <div>
          <div className={`rv ${styles.label}`}>{t(`works.${work.slug}.label`)}</div>
          <h2 className={`rv ${styles.title}`}>{t(`works.${work.slug}.title`)}</h2>
          <p className={`rv ${styles.desc}`}>{t(`works.${work.slug}.desc`)}</p>
          <div className={`rv ${styles.meta}`}>
            {work.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </div>
        <div className={`rv ${styles.thumb}`}>
          {work.thumb ? (
            <img
              className={styles.img}
              src={work.thumb}
              alt={t(`works.${work.slug}.title`)}
              loading="lazy"
            />
          ) : (
            <div className={styles.ph}>{work.glyph}</div>
          )}
        </div>
      </div>
    </section>
  );
}
