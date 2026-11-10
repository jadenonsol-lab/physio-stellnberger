import { Component, type ReactNode } from 'react'
import { ProceduralSpine, type PropsFocus } from './ProceduralSpine'
import type { MutableRefObject } from 'react'

type Props = {
  useGlb: boolean
  progress: MutableRefObject<number>
  focus: MutableRefObject<PropsFocus>
  children: ReactNode
}

type State = { failed: boolean }

export class ModelGate extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('GLB spine failed, falling back to procedural mesh', error)
  }

  render() {
    if (this.state.failed || !this.props.useGlb) {
      return <ProceduralSpine progress={this.props.progress} focus={this.props.focus} />
    }
    return this.props.children
  }
}
