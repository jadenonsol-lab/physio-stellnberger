import { useMemo, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  progress: MutableRefObject<number>
  focus: MutableRefObject<PropsFocus>
}

export type PropsFocus = 'full' | 'cervical' | 'thoracic' | 'lumbar' | 'pelvis'

const BONE = '#f2f4f5'
const DISC = '#5ad7e0'
const DISC_DIM = '#2a9aa3'
const HIGHLIGHT = '#ffe08a'

function rangeFor(focus: PropsFocus): [number, number] {
  switch (focus) {
    case 'cervical':
      return [0.72, 1]
    case 'thoracic':
      return [0.42, 0.75]
    case 'lumbar':
      return [0.18, 0.45]
    case 'pelvis':
      return [0, 0.22]
    default:
      return [0, 1]
  }
}

export function ProceduralSpine({ progress, focus }: Props) {
  const group = useRef<THREE.Group>(null)
  const mats = useRef<THREE.MeshStandardMaterial[]>([])
  const verts = useMemo(() => Array.from({ length: 24 }, (_, i) => i), [])
  const discs = useMemo(() => Array.from({ length: 22 }, (_, i) => i), [])

  useFrame((_, dt) => {
    if (!group.current) return
    group.current.rotation.y += dt * 0.045
    const p = progress.current
    group.current.rotation.z = Math.sin(p * Math.PI) * 0.06
    const [a, b] = rangeFor(focus.current)
    mats.current.forEach((mat, i) => {
      const t = i / Math.max(1, mats.current.length - 1)
      const inFocus = t >= a && t <= b
      if (mat.userData.kind === 'disc') {
        mat.color.set(inFocus ? DISC : DISC_DIM)
        mat.emissive.set(inFocus ? DISC : '#0a3a40')
        mat.emissiveIntensity = inFocus ? 0.9 : 0.15
      } else {
        mat.emissive.set(inFocus ? HIGHLIGHT : '#000000')
        mat.emissiveIntensity = inFocus ? 0.2 : 0
      }
    })
  })

  let matIndex = 0

  return (
    <group ref={group} position={[0, -0.1, 0]} scale={1.15}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.55, 0]}>
        <circleGeometry args={[1.45, 48]} />
        <meshBasicMaterial color="#007f8c" transparent opacity={0.22} />
      </mesh>

      {verts.map((i) => {
        const t = i / (verts.length - 1)
        const y = -1.35 + t * 2.7
        const curve = Math.sin(t * Math.PI) * 0.18
        const twist = Math.sin(t * Math.PI * 2) * 0.05
        const scale = 0.72 + (1 - Math.abs(t - 0.5) * 0.55)
        const idx = matIndex++
        return (
          <mesh
            key={`v-${i}`}
            position={[curve + twist, y, 0]}
            rotation={[0.12, 0, twist * 2]}
            castShadow
          >
            <boxGeometry args={[0.42 * scale, 0.16, 0.34 * scale]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) {
                  m.userData.kind = 'bone'
                  mats.current[idx] = m
                }
              }}
              color={BONE}
              roughness={0.42}
              metalness={0.08}
            />
          </mesh>
        )
      })}

      {discs.map((i) => {
        const t = (i + 0.5) / discs.length
        const y = -1.28 + t * 2.55
        const curve = Math.sin(t * Math.PI) * 0.18
        const idx = matIndex++
        return (
          <mesh key={`d-${i}`} position={[curve, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16, 0.045, 10, 24]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) {
                  m.userData.kind = 'disc'
                  mats.current[idx] = m
                }
              }}
              color={DISC_DIM}
              emissive="#0a3a40"
              emissiveIntensity={0.15}
              roughness={0.25}
              metalness={0.2}
              transparent
              opacity={0.92}
            />
          </mesh>
        )
      })}

      <mesh position={[0, -1.55, 0]} rotation={[0.2, 0, 0]} castShadow>
        <torusGeometry args={[0.55, 0.12, 12, 36, Math.PI]} />
        <meshStandardMaterial color={BONE} roughness={0.45} metalness={0.06} />
      </mesh>
      <mesh position={[-0.42, -1.72, 0.05]} castShadow>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color={BONE} roughness={0.4} />
      </mesh>
      <mesh position={[0.42, -1.72, 0.05]} castShadow>
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial color={BONE} roughness={0.4} />
      </mesh>

      <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[2.05, 0.008, 8, 96]} />
        <meshBasicMaterial color="#dff8fb" transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2.1, -0.3, 0.4]}>
        <torusGeometry args={[2.35, 0.006, 8, 96]} />
        <meshBasicMaterial color="#9ae7ef" transparent opacity={0.22} />
      </mesh>
    </group>
  )
}
