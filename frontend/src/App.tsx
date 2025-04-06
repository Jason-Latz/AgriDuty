import './App.css'
import Home from './components/Home'
import LandingPage from './components/LandingPage'
import ScrollHandler from './components/ScrollHandler'
import Features from './components/Features'

function App() {
  return (
    <div className="app">
      <ScrollHandler />

      {/* Banner Section */}
      <header className="banner">
        <div className="banner-content">
          <h1>WildTariffs</h1>
          <p>Make data-driven decisions based on tariffs and weather</p>
          <nav className="banner-nav">
            <a href="#home" onClick={(e) => {
              e.preventDefault();
              document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
            }}>Home</a>
            <a href="#about" onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}>About</a>
          </nav>
        </div>
      </header>
      {/* Main Content Sections */}
      <main>
        <LandingPage />
        <section className="section" id="home" style={{ scrollMarginTop: '80px' }}>
          <Home />
        <Features />
        </section>
        <section className="section" id="contact">
          <h2>Contact Us</h2>
          <p>Get in touch with our team for more information about our services.</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 WildTariffs. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
