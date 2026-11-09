import './SiteNav.css'

export function SiteNav() {
  return (
    <header className="site-nav">
      <a className="site-nav__brand" href="#top" aria-label="Physiotherapie Wilma Stellnberger">
        <span className="site-nav__mark">WS</span>
        <span className="site-nav__name">Stellnberger</span>
      </a>
      <nav className="site-nav__links" aria-label="Hauptnavigation">
        <a href="#leistungen">Leistungen</a>
        <a href="#ansatz">Ansatz</a>
        <a className="site-nav__cta" href="#kontakt">
          Termin anfragen
        </a>
      </nav>
    </header>
  )
}
