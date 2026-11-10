import { Suspense, useMemo, useRef, type MutableRefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { ProceduralSpine, type PropsFocus } from './ProceduralSpine'
import { GlbSpine } from './GlbSpine'
import { ModelGate } from './ModelGate'

type Props = {
  progress: MutableRefObject<number>
  focus: MutableRefObject<PropsFocus>
  useGlb: boolean
}

function CameraRig({
  progress,
  focus,
}: {
  progress: MutableRefObject<number>
  focus: MutableRefObject<PropsFocus>
}) {
  const { camera } = useThree()
  const target = useMemo(() => new THREE.Vector3(0, 0.05, 0), [])
  const desired = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const p = progress.current
    const f = focus.current
    const angle = -0.55 + p * Math.PI * 1.55
    const radius = 4.1 - Math.sin(p * Math.PI) * 0.55
    const elev =
      f === 'cervical'
        ? 1.15
        : f === 'thoracic'
          ? 0.55
          : f === 'lumbar'
            ? -0.05
            : f === 'pelvis'
              ? -0.55
              : 0.35 + Math.sin(p * Math.PI) * 0.25

    desired.set(Math.sin(angle) * radius, elev, Math.cos(angle) * radius)
    camera.position.lerp(desired, 0.1)
    target.set(
      0,
      f === 'cervical'
        ? 0.85
        : f === 'thoracic'
          ? 0.25
          : f === 'lumbar'
            ? -0.35
            : f === 'pelvis'
              ? -0.95
              : 0.05,
      0,
    )
    camera.lookAt(target)
  })

  return null
}

function Lights() {
  const spot = useRef<THREE.SpotLight>(null)
  useFrame(({ clock }) => {
    if (!spot.current) return
    spot.current.intensity = 28 + Math.sin(clock.elapsedTime * 0.7) * 2.5
  })
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 2]} intensity={1.35} castShadow />
      <spotLight
        ref={spot}
        position={[-3, 4, 3]}
        angle={0.55}
        penumbra={0.6}
        intensity={30}
        color="#b8f4ff"
      />
      <pointLight position={[0, -1.2, 2]} intensity={12} color="#5ad7e0" />
    </>
  )
}

export function SkeletonScene({ progress, focus, useGlb }: Props) {
  return (
    <Canvas
      className="skeleton-canvas"
      dpr={[1, 1.75]}
      camera={{ position: [2.8, 0.6, 3.6], fov: 38, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#00a8b8']} />
      <fog attach="fog" args={['#00a8b8', 7, 16]} />
      <Lights />
      <Suspense fallback={<ProceduralSpine progress={progress} focus={focus} />}>
        <ModelGate useGlb={useGlb} progress={progress} focus={focus}>
          <GlbSpine progress={progress} focus={focus} />
        </ModelGate>
      </Suspense>
      <ContactShadows position={[0, -1.7, 0]} opacity={0.35} scale={8} blur={2.4} far={4} />
      <CameraRig progress={progress} focus={focus} />
    </Canvas>
  )
}
