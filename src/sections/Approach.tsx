import './sections.css'

export function Approach() {
  return (
    <section id="ansatz" className="section section--approach">
      <div className="section__inner section__inner--split">
        <div className="approach__media">
          <img
            src="/assets/photos/portrait.jpg"
            alt="Wilma Stellnberger, Diplomphysiotherapeutin"
            width={441}
            height={441}
          />
        </div>
        <div className="approach__copy">
          <h2 className="section__title">Wilma Stellnberger</h2>
          <p className="section__lead">
            Diplomphysiotherapeutin und Mentaltrainerin. Seit 2006 freiberuflich tätig.
          </p>
          <p>
            Ausbildung in Steyr, Praxis in Maria Neustift, Bad Ischl und Gmunden. Fokus auf
            Orthopädie, Rehabilitation und die Einheit von Körper, Geist und Seele.
          </p>
        </div>
      </div>
    </section>
  )
}
