import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SkeletonScene } from './skeleton/SkeletonScene'
import type { PropsFocus } from './skeleton/ProceduralSpine'
import { BRAND, SCROLL_CHAPTERS } from '../data/scrollChapters'
import './SkeletonOrbitHero.css'

gsap.registerPlugin(ScrollTrigger)

function focusAt(progress: number): PropsFocus {
  const chapter = SCROLL_CHAPTERS.find((c) => progress >= c.progress[0] && progress < c.progress[1])
  return chapter?.focus ?? 'full'
}

export function SkeletonOrbitHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef(0)
  const focusRef = useRef<PropsFocus>('full')
  const [useGlb, setUseGlb] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/assets/models/spine.glb', { method: 'HEAD' })
      .then((r) => {
        const type = r.headers.get('content-type') || ''
        const ok = r.ok && !type.includes('text/html') && Number(r.headers.get('content-length') || 1) > 1000
        if (!cancelled && ok) setUseGlb(true)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const intro = introRef.current
    if (!section || !intro) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cards = gsap.utils.toArray<HTMLElement>('.orbit-chapter')

    const ctx = gsap.context(() => {
      if (reduce) {
        progressRef.current = 0.35
        focusRef.current = 'thoracic'
        gsap.set(intro, { opacity: 0, y: -20 })
        gsap.set(cards, { opacity: 1, y: 0 })
        return
      }

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.35,
        onUpdate: (self) => {
          progressRef.current = self.progress
          focusRef.current = focusAt(self.progress)

          const fade = gsap.utils.clamp(0, 1, self.progress / 0.1)
          gsap.set(intro, {
            opacity: 1 - fade,
            y: fade * -36,
            filter: `blur(${fade * 8}px)`,
          })

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${Math.max(0.04, self.progress)})`
          }

          cards.forEach((card, i) => {
            const chapter = SCROLL_CHAPTERS[i]
            const [a, b] = chapter.progress
            const mid = (a + b) / 2
            const span = Math.max(0.04, (b - a) * 0.55)
            const local = 1 - Math.min(1, Math.abs(self.progress - mid) / span)
            gsap.set(card, {
              opacity: local,
              y: (1 - local) * 28,
              scale: 0.96 + local * 0.04,
            })
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section id="top" className="orbit-hero" ref={sectionRef} aria-label="Hero Skelett Orbit">
      <div className="orbit-hero__sticky">
        <div className="orbit-hero__stage">
          <SkeletonScene progress={progressRef} focus={focusRef} useGlb={useGlb} />

          <div className="orbit-hero__intro" ref={introRef}>
            <p className="orbit-hero__brand">{BRAND.name}</p>
            <h1 className="orbit-hero__title">
              Bewegung
              <span>wieder spürbar</span>
            </h1>
            <p className="orbit-hero__lead">
              Scroll um die Wirbelsäule. Jeder Blick zeigt einen Service.
            </p>
            <div className="orbit-hero__actions">
              <a className="cta-primary" href="#kontakt">
                Termin anfragen
              </a>
              <a className="cta-ghost" href="#leistungen">
                Leistungen
              </a>
            </div>
          </div>

          <div className="orbit-hero__chapters" aria-live="polite">
            {SCROLL_CHAPTERS.map((chapter) => (
              <article key={chapter.id} className="orbit-chapter" data-focus={chapter.focus}>
                <h2>{chapter.title}</h2>
                <p>{chapter.body}</p>
              </article>
            ))}
          </div>

          <div className="orbit-hero__progress" aria-hidden="true">
            <span ref={progressBarRef} />
          </div>
        </div>
      </div>
    </section>
  )
}
