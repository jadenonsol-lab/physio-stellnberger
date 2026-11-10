import { useMemo, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as THREE from 'three'
import type { MutableRefObject } from 'react'
import type { PropsFocus } from './ProceduralSpine'

type Props = {
  progress: MutableRefObject<number>
  focus: MutableRefObject<PropsFocus>
}

const MODEL_URL = '/assets/models/spine.glb'

const draco = new DRACOLoader()
draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')

function gltfLoader() {
  const loader = new GLTFLoader()
  loader.setDRACOLoader(draco)
  return loader
}

export function GlbSpine({ progress, focus }: Props) {
  const gltf = useLoader(GLTFLoader, MODEL_URL, (loader) => {
    const l = loader as GLTFLoader
    l.setDRACOLoader(draco)
  })
  const group = useRef<THREE.Group>(null)

  const cloned = useMemo(() => {
    const scene = gltf.scene.clone(true)
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      mesh.receiveShadow = true
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      mats.forEach((m) => {
        const mat = m as THREE.MeshStandardMaterial
        if (!mat) return
        mat.roughness = Math.min(mat.roughness ?? 0.5, 0.55)
        mat.metalness = Math.min(mat.metalness ?? 0.1, 0.15)
        mat.envMapIntensity = 0.6
        mat.needsUpdate = true
      })
    })
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    scene.scale.setScalar(3.35 / maxDim)
    box.setFromObject(scene)
    const center = new THREE.Vector3()
    box.getCenter(center)
    scene.position.sub(center)
    scene.position.y -= 0.05
    return scene
  }, [gltf])

  useFrame((_, dt) => {
    if (!group.current) return
    const p = progress.current
    const f = focus.current
    group.current.rotation.y += dt * 0.03
    const focusLift =
      f === 'cervical' ? -0.4 : f === 'thoracic' ? -0.12 : f === 'lumbar' ? 0.18 : f === 'pelvis' ? 0.48 : 0
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, focusLift, 0.08)
    group.current.rotation.z = Math.sin(p * Math.PI) * 0.07
  })

  return (
    <group ref={group}>
      <primitive object={cloned} />
      <mesh rotation={[Math.PI / 2.35, 0.15, 0]}>
        <torusGeometry args={[2.15, 0.008, 8, 96]} />
        <meshBasicMaterial color="#e7fbff" transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2.05, -0.35, 0.5]}>
        <torusGeometry args={[2.45, 0.005, 8, 96]} />
        <meshBasicMaterial color="#9ae7ef" transparent opacity={0.18} />
      </mesh>
    </group>
  )
}

// silence unused helper in tree-shaking edge cases
void gltfLoader
