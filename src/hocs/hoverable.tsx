import * as React from 'react'

import { isMouseDevice, isTouchDevice } from '../libs/ua'

export interface ExternalProps {
  className?: string
  onMouseEnter?: (e: any) => void
  onMouseLeave?: (e: any) => void
  onTouchStart?: (e: any) => void
  onTouchEnd?: (e: any) => void
}

export interface InjectedProps {
  className: string
  onMouseEnter: (e: any) => void
  onMouseLeave: (e: any) => void
  onTouchStart: (e: any) => void
  onTouchEnd: (e: any) => void
}

interface Options {
  hoverClassName?: string
}

export const hoverable = ({ hoverClassName = 'hover' }: Options = {}) => <
  OriginalProps extends Record<string, unknown>
>(
  WrappedComponent: React.ComponentType<OriginalProps & InjectedProps>,
) => {
  return class HoverableComponent extends React.PureComponent<
    OriginalProps & ExternalProps,
    { isHover: boolean }
  > {
    public static displayName = `HoverableComponent(${WrappedComponent.displayName})`

    public state = {
      isHover: false,
    }

    public render() {
      const { isHover } = this.state

      return (
        <WrappedComponent
          {...this.props}
          className={`${isHover ? hoverClassName : ''} ${this.props.className || ''}`}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onTouchStart={this.onTouchStart}
          onTouchEnd={this.onTouchEnd}
        />
      )
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
  }
}
