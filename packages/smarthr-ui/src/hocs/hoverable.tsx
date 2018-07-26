import * as React from 'react'

import { isTouchDevice, isMouseDevice } from '../libs/ua'

interface ExternalProps {
  className?: string
  onMouseEnter?: (e: any) => void
  onMouseLeave?: (e: any) => void
  onTouchStart?: (e: any) => void
  onTouchEnd?: (e: any) => void
}
export interface InjectedProps extends React.Props<{}> {
  className?: string
  onMouseEnter?: (e: any) => void
  onMouseLeave?: (e: any) => void
  onTouchStart?: (e: any) => void
  onTouchEnd?: (e: any) => void
}
interface Options {
  hoverClassName?: string
}
interface State {
  isHover: boolean
}

const hoverable = ({ hoverClassName }: Options = {}) => <OriginalProps extends {}>(
  WrappedComponent: React.ComponentType<OriginalProps & InjectedProps>,
) => {
  return class HoverableComponent extends React.Component<OriginalProps & ExternalProps, State> {
    public state = {
      isHover: false,
    }

    public onMouseEnter = (e: any) => {
      const { onMouseEnter } = this.props
      if (onMouseEnter) onMouseEnter(e)
      if (isTouchDevice) return
      this.setState({ isHover: true })
    }

    public onMouseLeave = (e: any) => {
      const { onMouseLeave } = this.props
      if (onMouseLeave) onMouseLeave(e)
      if (isTouchDevice) return
      this.setState({ isHover: false })
    }

    public onTouchStart = (e: any) => {
      const { onTouchStart } = this.props
      if (onTouchStart) onTouchStart(e)
      if (isMouseDevice) return
      this.setState({ isHover: true })
    }

    public onTouchEnd = (e: any) => {
      const { onTouchEnd } = this.props
      if (onTouchEnd) onTouchEnd(e)
      if (isMouseDevice) return
      this.setState({ isHover: false })
    }

    public render(): JSX.Element {
      const { isHover } = this.state
      const { className } = this.props
      const hover = hoverClassName || 'hover'

      return (
        <WrappedComponent
          {...this.props}
          className={`${isHover ? hover : ''} ${className || ''}`}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onTouchStart={this.onTouchStart}
          onTouchEnd={this.onTouchEnd}
        />
      )
    }
  }
}

export default hoverable
