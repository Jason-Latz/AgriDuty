import './App.css'
import Home from './components/Home'
import LandingPage from './components/LandingPage'
import ScrollHandler from './components/ScrollHandler'

function App() {
  return (
    <div className="app">
      <ScrollHandler />
      {/* Banner Section */}
      <header className="banner">
        <div className="banner-content">
          <h1>AgriDuty</h1>
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
        </section>
        <section className="section" id="about" style={{ scrollMarginTop: '80px' }}>
          <h2>About Us</h2>
          <p>AgriDuty is a comprehensive platform designed to help farmers and agricultural businesses manage their operations efficiently.</p>
        </section>

        <section className="section" id="features">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Farm Management</h3>
              <p>Track and manage your farm operations with ease.</p>
            </div>
            <div className="feature-card">
              <h3>Resource Planning</h3>
              <p>Optimize your resources and maximize productivity.</p>
            </div>
            <div className="feature-card">
              <h3>Data Analytics</h3>
              <p>Make informed decisions with comprehensive analytics.</p>
            </div>
          </div>
        </section>

        <section className="section" id="contact">
          <h2>Contact Us</h2>
          <p>Get in touch with our team for more information about our services.</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 AgriDuty. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
