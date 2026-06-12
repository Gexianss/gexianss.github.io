import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll.js';
import FixedUI from '../layout/FixedUI.jsx';
import PageReveal from '../layout/PageReveal.jsx';
import GlowLayer from './GlowLayer.jsx';
import HeroPanel from './HeroPanel.jsx';
import AboutPanel from './AboutPanel.jsx';
import WorkPanel from './WorkPanel.jsx';
import ContactPanel from './ContactPanel.jsx';
import { works } from '../../data/works.js';
import styles from './HomePage.module.css';

export default function HomePage() {
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const glowRef = useRef(null);
  const { scrollToEl } = useHorizontalScroll({ trackRef, barRef, glowRef });
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) scrollToEl(document.querySelector(hash));
  }, [hash]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.viewport}>
      <PageReveal />
      <FixedUI onNavigateSection={(id) => scrollToEl(document.getElementById(id))} />
      <GlowLayer ref={glowRef} />
      <div className={styles.track} ref={trackRef}>
        <HeroPanel />
        <AboutPanel />
        {works.map((w, i) => (
          <WorkPanel key={w.slug} work={w} id={i === 0 ? 'works' : undefined} />
        ))}
        <ContactPanel id="contact" />
      </div>
      <div className={styles.progress}><div className={styles.bar} ref={barRef} /></div>
      <div className={styles.hint} aria-hidden="true">SCROLL →</div>
    </div>
  );
}
