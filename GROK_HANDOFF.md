# Grok Bot Handoff — Stellnberger Skeleton Orbit

## Goal
Premium physiotherapy demo. **Wow = 3D camera orbit around anatomical spine** while service chapters appear. Teal medical aesthetic (reference images in `public/assets/refs/`).

## Always publish via here.now
Anonymous sites expire in 24h. **Always save and return `claimUrl` + `expiresAt` + `siteUrl` exactly.**

Files:
- `.herenow/claim.json`
- `.herenow/state.json`
- `HERENOW.md`
- `/agent/artifacts/herenow-claim.json`

Publish helper:
```bash
cd /agent/demo && npm run build
/home/ubuntu/.agents/skills/here-now/scripts/publish.sh dist \
  --spa \
  --slug "$(jq -r .slug .herenow/claim.json)" \
  --claim-token "$(jq -r '.publishes | to_entries[0].value.claimToken' .herenow/state.json)" \
  --title "Physiotherapie Wilma Stellnberger" \
  --client grok
```
If claim expired: omit `--slug` / `--claim-token`, write the new claim payload into the files above.

## Stack
- Vite + React 19
- GSAP ScrollTrigger + Lenis
- Three.js via `@react-three/fiber` + `drei`
- Draco GLB: `public/assets/models/spine.glb` (~1.2MB optimized)

## Key files
| Path | Role |
|---|---|
| `src/components/SkeletonOrbitHero.tsx` | Sticky hero + scroll chapters |
| `src/components/skeleton/SkeletonScene.tsx` | R3F canvas, lights, camera rig |
| `src/components/skeleton/GlbSpine.tsx` | Anatomical GLB + slow spin |
| `src/components/skeleton/ProceduralSpine.tsx` | Fallback mesh if GLB missing |
| `src/components/skeleton/ModelGate.tsx` | Error boundary → procedural |
| `src/data/scrollChapters.ts` | Service chapters + focus zones |
| `assets-source/` | Raw Higgsfield spine PNG + unoptimized GLB |

## Scroll contract
- ~520vh section, sticky 100dvh stage
- `progressRef` / `focusRef` drive camera (no React state per frame)
- Orbit angle: `-0.55 → ~π*1.55` over progress
- Focus elevates camera for cervical / thoracic / lumbar / pelvis
- Intro fades in first 10% scroll; chapter cards crossfade by windows

## Brand / CTA
- Name: Physiotherapie Wilma Stellnberger
- Primary CTA label: **Termin anfragen**
- Phone: +43 660 6376123
- Places: Maria Neustift · Bad Ischl · Gmunden

## Local
```bash
cd /agent/demo
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

## Suggested next upgrades
1. Vertebra hotspots with tooltips synced to chapters
2. Slightly stronger disc emissive pulse on active focus
3. Mobile orbit radius tuning + lower DPR
4. Optional scroll-video alternate from `assets-source` stills if WebGL blocked
