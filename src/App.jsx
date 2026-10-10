import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from './pages/Dashboard';
function Home() {
  return (
    <div className="app">
      <nav className="navbar">
        <a href="/" className="logo">
          Skill<span>Loop</span>
        </a>

        <div className="nav-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#skills">Explore Skills</a>
          <a href="/login" className="login-link">
            Login
          </a>
          <a href="/signup" className="nav-button">
            Get Started
          </a>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">LEARN TOGETHER. GROW TOGETHER.</p>

            <h1>
              Your skills are
              <br />
              <span>worth sharing.</span>
            </h1>

            <p className="hero-description">
              Learn something new, teach what you know, and build real skills
              with your campus community.
            </p>

            <div className="hero-buttons">
              <a href="/signup" className="primary-button">
                Start Learning →
              </a>

              <a href="#how-it-works" className="secondary-button">
                Discover How
              </a>
            </div>

            <div className="hero-note">
              <span className="online-dot"></span>
              A community where everyone has something to teach.
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-card main-card">
              <div className="card-top">
                <span className="card-icon">✦</span>
                <span className="status-badge">YOUR NEXT SKILL</span>
              </div>

              <h3>Learn. Practice. Improve.</h3>

              <p>Small steps can create big opportunities.</p>

              <div className="skill-progress">
                <div className="progress-heading">
                  <span>Learning journey</span>
                  <strong>75%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill"></div>
                </div>
              </div>

              <div className="skill-tags">
                <span>💻 Coding</span>
                <span>🎨 Design</span>
                <span>🎤 Communication</span>
              </div>
            </div>

            <div className="floating-card floating-top">
              <span>💡</span>
              <div>
                <strong>Share your talent</strong>
                <p>Teach a skill today</p>
              </div>
            </div>

            <div className="floating-card floating-bottom">
              <span>🚀</span>
              <div>
                <strong>Build your future</strong>
                <p>One skill at a time</p>
              </div>
            </div>
          </div>
        </section>

        <section className="stats-section" id="skills">
          <div>
            <h3>Learn</h3>
            <p>Discover skills from other students.</p>
          </div>
          <div>
            <h3>Teach</h3>
            <p>Share your knowledge with others.</p>
          </div>
          <div>
            <h3>Build</h3>
            <p>Turn your learning into real projects.</p>
          </div>
          <div>
            <h3>Verify</h3>
            <p>Showcase your learning journey.</p>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <p className="eyebrow">YOUR JOURNEY STARTS HERE</p>

          <h2>
            One platform.
            <br />
            <span>Endless possibilities.</span>
          </h2>

          <p className="section-description">
            SkillLoop makes learning collaborative, practical, and meaningful.
          </p>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon purple">01</div>
              <h3>Find your skill</h3>
              <p>
                Explore topics you want to learn, from programming to
                communication.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon orange">02</div>
              <h3>Connect with peers</h3>
              <p>
                Meet students who can guide you and learn from your experience.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon green">03</div>
              <h3>Learn by doing</h3>
              <p>
                Practise your skills through activities, collaboration, and
                projects.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon blue">04</div>
              <h3>Show your growth</h3>
              <p>
                Build a portfolio that reflects the skills you develop over
                time.
              </p>
            </article>
          </div>
        </section>

        <section className="cta-section">
          <div>
            <p className="eyebrow">YOUR NEXT CHAPTER STARTS NOW</p>
            <h2>
              You have a skill.
              <br />
              Someone needs it.
            </h2>
            <p>
              Join SkillLoop and turn learning into a shared experience.
            </p>
          </div>

          <a href="/signup" className="primary-button">
            Join SkillLoop →
          </a>
        </section>
      </main>

      <footer className="footer">
        <a href="/" className="logo">
          Skill<span>Loop</span>
        </a>
        <p>Learn • Teach • Build • Verify</p>
        <p>© 2026 SkillLoop. Built for learners.</p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;