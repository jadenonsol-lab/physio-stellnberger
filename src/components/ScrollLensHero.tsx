import { useEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FRAME_PATHS, HERO_POSTER, frameIndexForProgress } from '../lib/frames'
import './ScrollLensHero.css'

gsap.registerPlugin(ScrollTrigger)

type Props = {
  onReady?: () => void
}

export function ScrollLensHero({ onReady }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const chapterRef = useRef<HTMLParagraphElement>(null)
  const [ready, setReady] = useState(false)
  const framesRef = useRef<(HTMLImageElement | undefined)[]>([])
  const progressRef = useRef(0)
  const lensStateRef = useRef({ x: 0.58, y: 0.46, size: 0.28 })
  const reducedRef = useRef(false)
  const drawRef = useRef<(progress: number) => void>(() => {})

  drawRef.current = (progress: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const frames = framesRef.current.filter(Boolean) as HTMLImageElement[]
    const idx = frameIndexForProgress(progress, Math.max(frames.length, 1))
    const img = frames[idx]

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#eef1f0'
    ctx.fillRect(0, 0, w, h)

    const source = img?.complete ? img : undefined
    if (!source) return

    const placed = coverRect(source, w, h)
    ctx.drawImage(source, placed.dx, placed.dy, placed.dw, placed.dh)

    // Paper wash outside the lens so the magnifier reads as the hero object
    ctx.fillStyle = 'rgba(238, 241, 240, 0.42)'
    ctx.fillRect(0, 0, w, h)

    const { x, y, size } = lensStateRef.current
    const radius = Math.min(w, h) * size * 0.5
    const cx = x * w
    const cy = y * h
    const zoom = 1.9 + progress * 0.4

    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.clip()

    ctx.fillStyle = '#eef1f0'
    ctx.fillRect(0, 0, w, h)

    const zw = placed.dw * zoom
    const zh = placed.dh * zoom
    const zx = cx - (cx - placed.dx) * zoom
    const zy = cy - (cy - placed.dy) * zoom
    ctx.drawImage(source, zx, zy, zw, zh)

    const grad = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius)
    grad.addColorStop(0, 'rgba(255,255,255,0.06)')
    grad.addColorStop(0.75, 'rgba(255,255,255,0)')
    grad.addColorStop(1, 'rgba(26,34,31,0.16)')
    ctx.fillStyle = grad
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2)
    ctx.restore()
  }

  useEffect(() => {
    let cancelled = false
    const images: (HTMLImageElement | undefined)[] = new Array(FRAME_PATHS.length)
    let loaded = 0

    const markReady = () => {
      if (cancelled) return
      framesRef.current = images
      setReady(true)
      onReady?.()
      drawRef.current(0)
    }

    // Prefetch poster first for instant paint
    const poster = new Image()
    poster.src = HERO_POSTER
    poster.onload = () => {
      if (!cancelled) drawRef.current(0)
    }

    FRAME_PATHS.forEach((src, i) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = src
      img.onload = () => {
        loaded += 1
        images[i] = img
        if (loaded === FRAME_PATHS.length) markReady()
      }
      img.onerror = () => {
        loaded += 1
        if (loaded === FRAME_PATHS.length) markReady()
      }
    })

    return () => {
      cancelled = true
    }
  }, [onReady])

  useEffect(() => {
    const section = sectionRef.current
    const lens = lensRef.current
    const copy = copyRef.current
    const chapter = chapterRef.current
    if (!section || !lens || !copy) return

    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const chapters = [
      'Körper lesen. Bewegung freigeben.',
      'Schmerz verstehen. Räume öffnen.',
      'Kraft zurückholen. Leichtigkeit spüren.',
      'Geist klären. Vitalität finden.',
    ]

    const syncLensChrome = (xPct: number, yPct: number, sizeCss: string) => {
      gsap.set(lens, {
        '--lx': `${xPct}%`,
        '--ly': `${yPct}%`,
        '--lsize': sizeCss,
      })
    }

    const onPointer = (e: PointerEvent) => {
      if (reducedRef.current || progressRef.current > 0.14) return
      const rect = section.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      lensStateRef.current.x = x
      lensStateRef.current.y = y
      gsap.to(lens, {
        '--lx': `${x * 100}%`,
        '--ly': `${y * 100}%`,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
        onUpdate: () => drawRef.current(progressRef.current),
      })
      drawRef.current(progressRef.current)
    }

    section.addEventListener('pointermove', onPointer)

    const ctx = gsap.context(() => {
      if (reducedRef.current) {
        lensStateRef.current = { x: 0.5, y: 0.48, size: 0.55 }
        syncLensChrome(50, 48, 'min(72vw, 34rem)')
        drawRef.current(1)
        return
      }

      lensStateRef.current = { x: 0.62, y: 0.42, size: 0.34 }
      syncLensChrome(62, 42, 'min(46vw, 20rem)')

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
        onUpdate: (self) => {
          const p = self.progress
          progressRef.current = p

          const size = gsap.utils.interpolate(0.34, 0.95, Math.min(1, p * 1.12))
          const lx = gsap.utils.interpolate(0.62, 0.5, Math.min(1, p * 1.2))
          const ly = gsap.utils.interpolate(0.42, 0.48, Math.min(1, p * 1.1))
          lensStateRef.current = { x: lx, y: ly, size }

          const sizeCss = `min(${Math.round(size * 118)}vw, ${Math.round(size * 58)}rem)`
          syncLensChrome(lx * 100, ly * 100, sizeCss)
          gsap.set(lens, { opacity: gsap.utils.interpolate(0.95, 1, p) })

          drawRef.current(p)

          const copyOut = gsap.utils.clamp(0, 1, (p - 0.04) / 0.18)
          gsap.set(copy, {
            opacity: 1 - copyOut,
            y: copyOut * -28,
            filter: `blur(${copyOut * 6}px)`,
          })

          const chapterIndex = Math.min(chapters.length - 1, Math.floor(p * chapters.length))
          if (chapter) {
            chapter.textContent = chapters[chapterIndex]
            const local = (p * chapters.length) % 1
            gsap.set(chapter, {
              opacity: local < 0.12 ? local / 0.12 : local > 0.88 ? (1 - local) / 0.12 : 1,
              y: (0.5 - local) * 18,
            })
          }
        },
      })

      drawRef.current(0)
    }, section)

    const onResize = () => drawRef.current(progressRef.current)
    window.addEventListener('resize', onResize)

    return () => {
      section.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [ready])

  return (
    <section id="top" className="lens-hero" ref={sectionRef} aria-label="Hero">
      <div className="lens-hero__sticky">
        <div className="lens-hero__stage">
          <canvas ref={canvasRef} className="lens-hero__canvas" aria-hidden="true" />
          <div className="lens-hero__veil" aria-hidden="true" />
          <div
            ref={lensRef}
            className="lens-hero__lens"
            aria-hidden="true"
            style={
              {
                '--lx': '62%',
                '--ly': '42%',
                '--lsize': 'min(46vw, 20rem)',
              } as CSSProperties
            }
          >
            <span className="lens-hero__lens-ring" />
            <span className="lens-hero__lens-glare" />
          </div>

          <div className="lens-hero__copy" ref={copyRef}>
            <p className="lens-hero__brand">Physiotherapie Wilma Stellnberger</p>
            <h1 className="lens-hero__title">
              Bewegung
              <span>wieder spürbar</span>
            </h1>
            <p className="lens-hero__lead">
              Physiotherapie und Mentaltraining. Klar, ganzheitlich, nah an dir.
            </p>
            <div className="lens-hero__actions">
              <a className="cta-primary" href="#kontakt">
                Termin anfragen
              </a>
              <a className="cta-ghost" href="#leistungen">
                Leistungen
              </a>
            </div>
          </div>

          <p className="lens-hero__chapter" ref={chapterRef}>
            Körper lesen. Bewegung freigeben.
          </p>

          {!ready ? <div className="lens-hero__loading" aria-hidden="true" /> : null}
        </div>
      </div>
    </section>
  )
}

function coverRect(img: HTMLImageElement, w: number, h: number) {
  const ir = img.width / img.height
  const cr = w / h
  let dw = w
  let dh = h
  let dx = 0
  let dy = 0
  if (ir > cr) {
    dw = h * ir
    dx = (w - dw) / 2
  } else {
    dh = w / ir
    dy = (h - dh) / 2
  }
  return { dx, dy, dw, dh }
}
