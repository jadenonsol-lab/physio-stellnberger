import { useEffect, useState } from 'react'
import { ScrollLensHero } from './components/ScrollLensHero'
import { SiteNav } from './components/SiteNav'
import { Approach } from './sections/Approach'
import { Contact } from './sections/Contact'
import { Services } from './sections/Services'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  const [heroApproved, setHeroApproved] = useState(false)
  useSmoothScroll()

  useEffect(() => {
    document.documentElement.dataset.demo = 'stellnberger-lens'
  }, [])

  return (
    <>
      <SiteNav />
      <main>
        <ScrollLensHero onReady={() => setHeroApproved(true)} />
        <Services />
        <Approach />
        <Contact />
      </main>
      <footer className="site-footer">
        <p>Physiotherapie Wilma Stellnberger</p>
        <p>Maria Neustift · Bad Ischl · Gmunden</p>
        {!heroApproved ? null : <span className="sr-only">Hero ready</span>}
      </footer>
    </>
  )
}
