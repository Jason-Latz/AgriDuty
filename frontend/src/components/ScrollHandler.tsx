import { useEffect, useState } from 'react';

const ScrollHandler: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const landingPage = document.querySelector('.landing-page');
      if (landingPage) {
        const landingPageBottom = landingPage.getBoundingClientRect().bottom;
        setIsScrolled(landingPageBottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const banner = document.querySelector('.banner');
    if (banner) {
      if (isScrolled) {
        banner.classList.add('scrolled');
      } else {
        banner.classList.remove('scrolled');
      }
    }
  }, [isScrolled]);

  return null;
};

export default ScrollHandler; 