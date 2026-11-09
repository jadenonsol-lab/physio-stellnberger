import './sections.css'

export function Contact() {
  return (
    <section id="kontakt" className="section section--contact">
      <div className="section__inner section__inner--contact">
        <h2 className="section__title">Termin anfragen</h2>
        <p className="section__lead">
          Terminanfragen montags 9.30 bis 11.30 Uhr persönlich am Telefon.
        </p>
        <a className="cta-phone" href="tel:+436606376123">
          +43 660 6376123
        </a>
        <p className="contact__note">
          Außerhalb dieser Zeit: Mobilbox oder SMS. Wilma Stellnberger, Dipl. PT.
        </p>
        <p className="contact__places">Maria Neustift · Bad Ischl · Gmunden</p>
      </div>
    </section>
  )
}
