import './sections.css'

const items = [
  {
    title: 'Physiotherapie',
    text: 'Prävention und Wiederherstellung schmerzfreier Bewegung. Orthopädie, Haltung, postoperativ.',
  },
  {
    title: 'Mentaltraining',
    text: 'Unbewusste Blockaden aufspüren und lösen. Für Zielklarheit und Heilungsprozesse.',
  },
  {
    title: 'Ganzheitliche Begleitung',
    text: 'Körper, Geist und Seele im Blick. Massage, Energiearbeit und feinstoffliche Techniken.',
  },
]

export function Services() {
  return (
    <section id="leistungen" className="section section--services">
      <div className="section__inner">
        <h2 className="section__title">Was dich erwartet</h2>
        <p className="section__lead">
          Individuelle Behandlung statt Schema F. Exakt auf dich abgestimmt.
        </p>
        <ul className="service-list">
          {items.map((item) => (
            <li key={item.title} className="service-list__item">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
