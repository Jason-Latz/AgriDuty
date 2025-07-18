import { useEffect, useState } from 'react';

// Component that toggles a CSS class on the page banner once the landing
// section has scrolled out of view.
const ScrollHandler: React.FC = () => {
  // Tracks whether the landing page is no longer visible
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const landingPage = document.querySelector('.landing-page');
    const handleScroll = () => {
      if (landingPage) {
        const bottom = (landingPage as HTMLElement).getBoundingClientRect().bottom;
        setIsScrolled(bottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const banner = document.querySelector('.banner');
    if (banner) {
      banner.classList.toggle('scrolled', isScrolled);
    }
  }, [isScrolled]);

  return null;
};

export default ScrollHandler; 
