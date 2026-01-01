import React, { useEffect, useState } from 'react';
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
import Preloader from './components/Preloader';
import TechMarquee from './components/TechMarquee';

function App() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState('privacy');

  const openLegalModal = (type) => {
    setLegalModalType(type);
    setLegalModalOpen(true);
  };

  const closeLegalModal = () => {
    setLegalModalOpen(false);
  };

  useEffect(() => {
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

    const hiddenElements = document.querySelectorAll('section, .animate-on-scroll');
    hiddenElements.forEach((el) => {
      el.classList.add('fade-in-section');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      {/* <Preloader /> - Replaced by static index.html loader */}
      {/* <ScrollProgress /> - Causing crash, kept disabled */}
      <Header />
      <main>
        <Hero />
        <TechMarquee />
        <Services />
        <Projects />
        <Skills />
        <Experience />
        <Education />
        <Certifications />
        <Contact />
      </main>
      <Footer onOpenLegal={openLegalModal} />
      <ResumeModal />
      <LegalModal isOpen={legalModalOpen} type={legalModalType} onClose={closeLegalModal} />
      <ScrollToTop />
    </div>
  );
}

export default App;
