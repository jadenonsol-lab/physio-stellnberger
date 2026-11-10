export type ScrollChapter = {
  id: string
  title: string
  body: string
  focus: 'full' | 'cervical' | 'thoracic' | 'lumbar' | 'pelvis'
  progress: [number, number]
}

export const SCROLL_CHAPTERS: ScrollChapter[] = [
  {
    id: 'intro',
    title: 'Den Körper neu lesen',
    body: 'Wir starten bei der Struktur. Scrollen öffnet den Blick um die Wirbelsäule.',
    focus: 'full',
    progress: [0, 0.12],
  },
  {
    id: 'physio',
    title: 'Physiotherapie',
    body: 'Schmerzfreie Bewegung zurückholen. Prävention, Orthopädie, postoperativ.',
    focus: 'cervical',
    progress: [0.12, 0.34],
  },
  {
    id: 'haltung',
    title: 'Haltung und Kraft',
    body: 'Stabilität aufbauen, Belastung verteilen, Alltagsbewegung wieder leicht machen.',
    focus: 'thoracic',
    progress: [0.34, 0.56],
  },
  {
    id: 'rehab',
    title: 'Rehabilitation',
    body: 'Nach Verletzung oder OP: gezielte Schritte zurück zu Belastung und Leben.',
    focus: 'lumbar',
    progress: [0.56, 0.78],
  },
  {
    id: 'mental',
    title: 'Mentaltraining',
    body: 'Blockaden lösen, die Heilung und Zielklarheit im Weg stehen.',
    focus: 'pelvis',
    progress: [0.78, 1],
  },
]

export const BRAND = {
  name: 'Physiotherapie Wilma Stellnberger',
  short: 'Stellnberger',
  phone: '+43 660 6376123',
  phoneHref: 'tel:+436606376123',
  places: 'Maria Neustift · Bad Ischl · Gmunden',
}
