import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

const HomePage = () => (
  <>
    <Hero />
    <Publications />
    <Projects />
    <TechMarquee />
  </>
);

const ExperiencePage = () => (
  <>
    <Experience />
    <Publications />
    <Education />
    <Certifications />
  </>
);

function App() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState('privacy');
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
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Small delay to ensure DOM is rendered
    setTimeout(() => {
      const hiddenElements = document.querySelectorAll('section, .animate-on-scroll');
      hiddenElements.forEach((el) => {
        el.classList.add('fade-in-section');
        observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, [location.pathname]); // Re-run when path changes

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<Services />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer onOpenLegal={openLegalModal} />
      <ResumeModal />
      <LegalModal isOpen={legalModalOpen} type={legalModalType} onClose={closeLegalModal} />
      <ScrollToTop />
    </div>
  );
}

export default App;
