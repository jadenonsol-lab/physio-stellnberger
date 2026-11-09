const FRAME_COUNT = 84

export const FRAME_PATHS = Array.from({ length: FRAME_COUNT }, (_, i) => {
  const n = String(i + 1).padStart(3, '0')
  return `/assets/frames/f-${n}.jpg`
})

export const HERO_POSTER = '/assets/hero-poster.jpg'
export const HERO_VIDEO = '/assets/hero-scrub.mp4'
export const HERO_VIDEO_MOBILE = '/assets/hero-scrub-mobile.mp4'

export function frameIndexForProgress(progress: number, count = FRAME_COUNT) {
  const p = Math.min(1, Math.max(0, progress))
  return Math.min(count - 1, Math.floor(p * (count - 1)))
}
