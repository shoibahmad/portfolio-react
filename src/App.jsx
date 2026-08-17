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
import Scroll3DShowcase from './components/Scroll3DShowcase';
import AboutWalkthrough from './components/AboutWalkthrough';
import AnimatedBackground from './components/ui/AnimatedBackground';
import CustomCursor from './components/ui/CustomCursor';
import Reveal3D from './components/ui/Reveal3D';
import ImmersiveBackground from './components/three/ImmersiveBackground';

// No `filter` here on purpose. Framer leaves the settled value as
// `filter: blur(0px)`, and any non-`none` filter makes the element a containing
// block — which breaks `position: sticky` in the scroll-pinned walkthrough below.
// Dropping it also removes a full-page filter pass on every route change.
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] } }
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ width: '100%', position: 'relative', zIndex: 1 }}
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
    {/* Hero drives its own scroll-linked parallax, so it is not wrapped */}
    <Hero />
    {/* Deliberately NOT inside Reveal3D: that wrapper sets `perspective` and
        animates a transform, and either one turns into a containing block that
        breaks the sticky pinning this section depends on. */}
    <AboutWalkthrough />
    <Reveal3D preset="depth" amount={0.08}>
      <Scroll3DShowcase />
    </Reveal3D>
    <Reveal3D preset="tilt">
      <Publications />
    </Reveal3D>
    <Reveal3D preset="rise">
      <TechMarquee />
    </Reveal3D>
  </PageWrapper>
);

const ExperiencePage = () => (
  <PageWrapper>
    <Reveal3D preset="tilt">
      <Experience />
    </Reveal3D>
    <Reveal3D preset="flipL">
      <Publications />
    </Reveal3D>
    <Reveal3D preset="flipR">
      <Education />
    </Reveal3D>
    <Reveal3D preset="rise">
      <Certifications />
    </Reveal3D>
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
    }, 400);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="App">
      <CustomCursor />
      <AnimatedBackground />
      <ImmersiveBackground />
      <ScrollProgress />
      <Header onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)} />
      <Breadcrumb />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<PageWrapper><Reveal3D preset="tilt"><Services /></Reveal3D></PageWrapper>} />
            {/* Projects is not 3D-wrapped: its directory pane is position:sticky, and an
                animated-transform ancestor shifts the coordinate space sticky resolves against. */}
            <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
            <Route path="/skills" element={<PageWrapper><Reveal3D preset="tilt"><Skills /></Reveal3D></PageWrapper>} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/resume" element={<PageWrapper><Reveal3D preset="rise"><InteractiveResume /></Reveal3D></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Reveal3D preset="rise"><Contact /></Reveal3D></PageWrapper>} />
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
