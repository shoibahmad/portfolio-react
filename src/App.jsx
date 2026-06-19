import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Education from './components/Education';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ResumeModal from './components/ResumeModal';
import LegalModal from './components/LegalModal';
import ScrollToTop from './components/ScrollToTop';
import Publications from './components/Publications';
import TechMarquee from './components/TechMarquee';
import Breadcrumb from './components/Breadcrumb';
import ScrollProgress from './components/ScrollProgress';
import InteractiveResume from './components/InteractiveResume';
import TerminalModal from './components/TerminalModal';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ width: '100%' }}
    onAnimationComplete={() => {
      // Re-trigger intersection observer after page transition
      const hiddenElements = document.querySelectorAll('section, .animate-on-scroll');
      hiddenElements.forEach((el) => el.classList.add('is-visible'));
    }}
  >
    {children}
  </motion.div>
);

const HomePage = () => (
  <PageWrapper>
    <Hero />
    <Publications />
    <TechMarquee />
  </PageWrapper>
);

const ExperiencePage = () => (
  <PageWrapper>
    <Experience />
    <Publications />
    <Education />
    <Certifications />
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

  const closeLegalModal = () => {
    setLegalModalOpen(false);
  };

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -30px 0px'
    });

    // Delay to let Framer Motion page animation complete first
    const timeout = setTimeout(() => {
      const hiddenElements = document.querySelectorAll('section, .animate-on-scroll');
      hiddenElements.forEach((el) => {
        observer.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="App">
      <ScrollProgress />
      <Header onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)} />
      <Breadcrumb />
      <main>
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
      <ResumeModal />
      <LegalModal isOpen={legalModalOpen} type={legalModalType} onClose={closeLegalModal} />
      <TerminalModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <ScrollToTop />

    </div>
  );
}

export default App;
