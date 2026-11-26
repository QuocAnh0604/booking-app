import { useState } from 'react'
import './App.css'

type IconName = 'arrow' | 'spark' | 'search' | 'calendar' | 'check' | 'menu'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    spark: <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Zm7.2 13.5.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    calendar: <><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M7 3v3m10-3v3M3 9h18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

const services = [
  { name: 'Wellness', detail: 'Massage, yoga & more', icon: '✦', color: 'lavender' },
  { name: 'Beauty', detail: 'Hair, nails & skincare', icon: '◒', color: 'peach' },
  { name: 'Home care', detail: 'Cleaning, repair & care', icon: '⌂', color: 'sage' },
  { name: 'Learning', detail: 'Classes & coaching', icon: '↗', color: 'butter' },
]

const providers = [
  { name: 'Mia Nguyen', role: 'Holistic facialist', place: 'District 1, HCMC', rating: '4.9', initials: 'MN', color: 'avatar-coral' },
  { name: 'The Good Fix', role: 'Home maintenance', place: 'Thu Duc, HCMC', rating: '4.8', initials: 'GF', color: 'avatar-blue' },
  { name: 'Juno Studio', role: 'Pilates & movement', place: 'Tay Ho, Hanoi', rating: '5.0', initials: 'JS', color: 'avatar-gold' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="site-shell">
      <header className="nav-wrap"><nav className="nav container" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Nook home"><span className="brand-mark">n</span><span>nook</span></a>
        <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name="menu" /></button>
        <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}><a className="nav-active" href="#top" onClick={() => setMenuOpen(false)}>Home</a><a href="#services" onClick={() => setMenuOpen(false)}>Explore services</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><div className="nav-auth"><a className="login-link" href="/login">Log in</a><a className="register-link" href="/register">Register</a></div></div>
      </nav></header>
      <main id="top">
        <section className="hero container"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-dot" />Your time, well spent</p><h1>Make room for <em>what matters.</em></h1><p className="hero-lede">Find trusted people for the things on your list, and book them in a few easy taps.</p><div className="hero-actions"><a className="button button-primary" href="#services">Explore services <Icon name="arrow" /></a><a className="text-link" href="#how-it-works">See how it works <Icon name="arrow" size={16} /></a></div><div className="hero-proof"><div className="proof-avatars"><span>AM</span><span>LN</span><span>TK</span><span className="proof-more">+</span></div><p><strong>12,000+</strong> happy bookings this month</p></div></div>
          <div className="hero-art" aria-label="A selection of bookable services"><div className="sun-shape" /><div className="art-note note-top"><span className="note-icon"><Icon name="spark" size={14} /></span><span>Good things<br /><strong>are waiting</strong></span></div><div className="portrait-card"><div className="portrait-head">✦</div><div className="portrait-body"><span className="portrait-tag">FRESH START</span><strong>Your next<br />chapter begins<br /><i>here.</i></strong></div></div><div className="floating-card booking-card"><span className="mini-label">NEXT UP</span><strong>Facial ritual</strong><span className="booking-time"><Icon name="calendar" size={14} /> Tomorrow · 10:30</span><span className="booking-check"><Icon name="check" size={13} /></span></div><div className="floating-card rating-card"><span className="rating-star">★</span><strong>4.9</strong><span>from 3.2k reviews</span></div><div className="art-tape">N O O K&nbsp;&nbsp; / &nbsp;&nbsp;BOOK BETTER</div></div>
        </section>
        <section className="category-strip" id="services"><div className="container"><div className="section-heading compact-heading"><div><p className="eyebrow">Start somewhere good</p><h2>What do you need today?</h2></div><a className="text-link" href="#all-services">View all services <Icon name="arrow" size={16} /></a></div><div className="service-grid">{services.map((service) => <a className="service-card" href="#all-services" key={service.name}><span className={`service-icon ${service.color}`}>{service.icon}</span><span><strong>{service.name}</strong><small>{service.detail}</small></span><span className="card-arrow">↗</span></a>)}</div></div></section>
        <section className="steps-section container" id="how-it-works"><div className="section-heading"><div><p className="eyebrow">The easy part</p><h2>From “I should”<br />to “it’s done.”</h2></div><p className="heading-note">No calls, no back-and-forth.<br />Just more time for you.</p></div><div className="steps-grid"><article><span className="step-number">01</span><h3>Tell us what you need</h3><p>Browse thoughtfully chosen services from people who know their craft.</p></article><article><span className="step-number">02</span><h3>Choose your moment</h3><p>See clear pricing and real availability. Pick a time that works for you.</p></article><article><span className="step-number">03</span><h3>Enjoy the extra space</h3><p>Get reminders and updates, then show up to a job well done.</p></article></div></section>
        <section className="providers-section" id="all-providers"><div className="container" id="all-services"><div className="section-heading compact-heading"><div><p className="eyebrow">People worth knowing</p><h2>Meet your new favourites.</h2></div><a className="text-link" href="#all-providers">Meet all providers <Icon name="arrow" size={16} /></a></div><div className="provider-grid">{providers.map((provider) => <article className="provider-card" key={provider.name}><div className={`provider-photo ${provider.color}`}><span>{provider.initials}</span><button type="button" aria-label={`Save ${provider.name}`} className="save-button">♡</button></div><div className="provider-info"><div><h3>{provider.name}</h3><p>{provider.role}</p></div><span className="rating">★ {provider.rating}</span></div><p className="provider-place">{provider.place}</p></article>)}</div></div></section>
        <section className="quote-section container" id="about"><div className="quote-mark">“</div><blockquote>Nook makes taking care of myself feel less like another task, and more like a little gift I get to give myself.</blockquote><div className="quote-author"><span className="author-avatar">SL</span><span><strong>Sarah L.</strong><small>Nook member since 2023</small></span></div></section>
        <section className="final-cta container"><div><p className="eyebrow">A little more life</p><h2>Your calendar called.<br /><em>It wants some joy in it.</em></h2></div><a className="button button-light" href="#services">Find your next thing <Icon name="arrow" /></a></section>
      </main>
      <footer className="footer"><div className="container footer-inner"><div><a className="brand footer-brand" href="#top"><span className="brand-mark">n</span><span>nook</span></a><p>Good services.<br />More space for life.</p></div><div className="footer-links"><div><strong>Explore</strong><a href="#services">All services</a><a href="#all-providers">Top providers</a><a href="#how-it-works">How it works</a></div><div><strong>Company</strong><a href="#about">About us</a><a href="#about">Journal</a><a href="#about">Careers</a></div><div><strong>Need a hand?</strong><a href="#about">Help centre</a><a href="#about">Contact us</a><a href="#about">Become a provider</a></div></div></div><div className="container footer-bottom"><span>© 2024 Nook, for your good days.</span><span>Made with intention in Vietnam <span className="heart">♥</span></span></div></footer>
    </div>
  )
}

export default App
