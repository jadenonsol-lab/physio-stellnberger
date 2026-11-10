import { SiteNav } from './components/SiteNav'
import { SkeletonOrbitHero } from './components/SkeletonOrbitHero'
import { Approach } from './sections/Approach'
import { Contact } from './sections/Contact'
import { Services } from './sections/Services'
import { useSmoothScroll } from './hooks/useSmoothScroll'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <SiteNav />
      <main>
        <SkeletonOrbitHero />
        <Services />
        <Approach />
        <Contact />
      </main>
      <footer className="site-footer">
        <p>Physiotherapie Wilma Stellnberger</p>
        <p>Maria Neustift · Bad Ischl · Gmunden</p>
      </footer>
    </>
  )
}
