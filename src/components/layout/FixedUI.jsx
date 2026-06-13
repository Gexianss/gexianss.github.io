import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme.jsx';
import { toggleLang } from '../../i18n/index.js';
import styles from './FixedUI.module.css';

export default function FixedUI({ onNavigateSection }) {
  const { t } = useTranslation();
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const sectionLink = (id, label) =>
    isHome ? (
      <a
        href={`#${id}`}
        onClick={(e) => {
          e.preventDefault();
          onNavigateSection?.(id);
        }}
      >
        {label}
      </a>
    ) : (
      <Link to={`/#${id}`}>{label}</Link>
    );

  return (
    <>
      <Link to="/" className={styles.logo} aria-label="Home">
        張
      </Link>
      <nav className={styles.nav}>
        <Link to="/resume">{t('nav.resume')}</Link>
        {sectionLink('works', t('nav.works'))}
        {sectionLink('contact', t('nav.contact'))}
        <span className={styles.sep} />
        <button className={styles.pill} onClick={toggleLang}>
          {t('nav.lang')}
        </button>
        <button className={styles.pill} onClick={toggle}>
          {theme === 'dark' ? t('nav.themeDark') : t('nav.themeLight')}
        </button>
      </nav>
      <a
        className={styles.github}
        href="https://github.com/Gexianss"
        target="_blank"
        rel="noreferrer"
      >
        GITHUB — GEXIANSS
      </a>
    </>
  );
}
