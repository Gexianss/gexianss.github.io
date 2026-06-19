import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { prefersReducedMotion } from './hooks/useReducedMotion.js';
import SplashCursor from './components/common/SplashCursor.jsx';
import HomePage from './components/home/HomePage.jsx';
import WorkDetail from './components/work/WorkDetail.jsx';
import ResumePage from './components/resume/ResumePage.jsx';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/works/:slug" element={<WorkDetail />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        {!prefersReducedMotion() && <SplashCursor RAINBOW_MODE={false} COLOR="#7e9cd8" />}
        <AnimatedRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}
