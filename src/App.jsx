import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import NotFound from './components/NotFound';
import Reveal from './components/ui/Reveal';
import PageTransition from './components/PageTransition';
import useDocumentMeta from './hooks/useDocumentMeta';
import { findRouteMeta, NOT_FOUND_META } from './data/routes';
import { findProjectBySlug } from './data/projects';

/* ---------------------------------------------------------------------------
   Page compositions
   ---------------------------------------------------------------------------
   Each route's content is wrapped in a `<div className="page">` so the
   interior-page spacing rule in index.css still applies. The actual route
   transition animation is handled by <PageTransition> in the JSX below.
   ------------------------------------------------------------------------ */

const HomePage = () => (
  <div className="page">
    {/* Hero drives its own scroll-linked parallax, so it is not wrapped */}
    <Hero />
    <About />
    <Reveal>
      <Publications />
    </Reveal>
    <Reveal variant="soft">
      <TechMarquee />
    </Reveal>
  </div>
);

const ExperiencePage = () => (
  <div className="page">
    <Reveal>
      <Experience />
    </Reveal>
    <Reveal>
      <Education />
    </Reveal>
    <Reveal>
      <Certifications />
    </Reveal>
  </div>
);

const Page = ({ children }) => (
  <div className="page" style={{ width: '100%', position: 'relative' }}>
    {children}
  </div>
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

  /* Resolve the document metadata for whatever the URL currently is. Project
     detail routes are not in the route table — they are generated from the
     catalogue — so they are matched separately here. */
  const meta = useMemo(() => {
    const routeMeta = findRouteMeta(location.pathname);
    if (routeMeta) return routeMeta;

    const projectMatch = location.pathname.match(/^\/projects\/(.+?)\/?$/);
    if (projectMatch) {
      const project = findProjectBySlug(projectMatch[1]);
      if (project) {
        return {
          title: `${project.title} — Shoib Ahmad`,
          description: project.description
        };
      }
    }

    return NOT_FOUND_META;
  }, [location.pathname]);

  useDocumentMeta({ ...meta, pathname: location.pathname });

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
    }, 400);

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
        <PageTransition>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<Page><Services /></Page>} />
            <Route path="/projects" element={<Page><Projects /></Page>} />
            {/* Same component: the slug selects and opens a case study, so a
                shared link lands directly on that project. */}
            <Route path="/projects/:slug" element={<Page><Projects /></Page>} />
            <Route path="/skills" element={<Page><Skills /></Page>} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/resume" element={<Page><InteractiveResume /></Page>} />
            <Route path="/contact" element={<Page><Contact /></Page>} />
            {/* Catch-all. Without it an unknown path rendered the chrome around
                an empty middle, which reads as broken rather than as wrong. */}
            <Route path="*" element={<Page><NotFound /></Page>} />
          </Routes>
        </PageTransition>
      </main>

      <Footer onOpenLegal={openLegalModal} />

      <LegalModal isOpen={legalModalOpen} type={legalModalType} onClose={closeLegalModal} />
      <TerminalModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
      <ScrollToTop />
    </div>
  );
}

export default App;

