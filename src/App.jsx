import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import ScrollToTop from './components/ScrollToTop';
import Publications from './components/Publications';
import TechMarquee from './components/TechMarquee';
import Breadcrumb from './components/Breadcrumb';
import ScrollProgress from './components/ScrollProgress';
import InteractiveResume from './components/InteractiveResume';
import TerminalModal from './components/TerminalModal';
import Reveal from './components/ui/Reveal';

/* No `filter` in these variants on purpose. Framer leaves the settled value as
   `filter: blur(0px)`, and any non-`none` filter makes the element a containing
   block, which breaks `position: sticky` in descendants. It also removes a
   full-page filter pass on every route change. */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="page"
    style={{ width: '100%', position: 'relative' }}
    onAnimationComplete={() => {
      // The page transition can outlast the IntersectionObserver's first pass,
      // which would leave above-the-fold children stuck at opacity 0.
      document
        .querySelectorAll('.animate-on-scroll')
        .forEach((el) => el.classList.add('is-visible'));
    }}
  >
    {children}
  </motion.div>
);

const HomePage = () => (
  <PageWrapper>
    {/* Hero drives its own scroll-linked parallax, so it is not wrapped */}
    <Hero />
    <About />
    <Reveal>
      <Publications />
    </Reveal>
    <Reveal variant="soft">
      <TechMarquee />
    </Reveal>
  </PageWrapper>
);

const ExperiencePage = () => (
  <PageWrapper>
    <Reveal>
      <Experience />
    </Reveal>
    <Reveal>
      <Education />
    </Reveal>
    <Reveal>
      <Certifications />
    </Reveal>
  </PageWrapper>
);

function App() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState('privacy');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const location = useLocation();

  const openLegalModal = (type) => {
    setLegalModalType(type);
    setLegalModalOpen(true);
  };

  const closeLegalModal = () => setLegalModalOpen(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // One-shot: an element that has arrived never needs watching again
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    );

    // Delay so the route transition settles before elements are measured
    const timeout = setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    }, 350);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="App">
      <a className="skip-link" href="#main">Skip to content</a>

      <ScrollProgress />
      <Header onToggleTerminal={() => setIsTerminalOpen((open) => !open)} />
      <Breadcrumb />

      <main id="main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
            <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
            <Route path="/skills" element={<PageWrapper><Skills /></PageWrapper>} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/resume" element={<PageWrapper><InteractiveResume /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer onOpenLegal={openLegalModal} />

      <LegalModal isOpen={legalModalOpen} type={legalModalType} onClose={closeLegalModal} />
      <TerminalModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <ScrollToTop />
    </div>
  );
}

export default App;
