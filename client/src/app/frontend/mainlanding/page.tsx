'use client';
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import VisionSection from './VisionSection';
import FeaturesSection from './FeaturesSection';
import AboutSection from './AboutSection';
import CtaSection from './CtaSection';
import Footer from './Footer';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <HeroSection />
      <VisionSection />
      <FeaturesSection />
      <AboutSection />
      <CtaSection />
      <Footer />
    </div>
  );
}