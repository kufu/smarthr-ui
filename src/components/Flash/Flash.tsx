import * as React from 'react'
import styled, { css, keyframes } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { Icon, iconMap } from '../Icon'
import { SecondaryButton } from '../Button/SecondaryButton'

interface Props {
  type: 'success' | 'info' | 'warning' | 'error' | ''
  text: string
  visible: boolean
  className?: string
  onClose: () => void
}

interface State {
  visible: boolean
}

type MergedProps = Props & InjectedProps

const REMOVE_DELAY = 8000

class FlashComponent extends React.PureComponent<MergedProps, State> {
  public static getDerivedStateFromProps(props: Props) {
    return {
      visible: props.visible,
    }
  }

  public timerId: any = 0

  constructor(props: MergedProps) {
    super(props)

    this.state = {
      visible: props.visible,
    }
  }

  public componentDidMount() {
    if (this.state.visible) {
      this.timerId = setTimeout(this.props.onClose, REMOVE_DELAY) as any
    }
  }

  public componentDidUpdate(prevProps: MergedProps) {
    if (!prevProps.visible && this.props.visible) {
      this.timerId = setTimeout(this.props.onClose, REMOVE_DELAY) as any
    }

    if (prevProps.visible && !this.props.visible) {
      clearTimeout(this.timerId)
    }
  }

  public componentWillUnmount() {
    clearTimeout(this.timerId)
  }

  public render() {
    const { visible } = this.state
    const { type, text, onClose, theme, className } = this.props

    let iconName: keyof typeof iconMap = 'fa-check-circle'
    let iconColor = theme.palette.TEXT_GREY

    switch (type) {
      case 'success':
        iconName = 'fa-check-circle'
        iconColor = theme.palette.MAIN
        break
      case 'info':
        iconName = 'fa-info-circle'
        iconColor = theme.palette.TEXT_GREY
        break
      case 'warning':
        iconName = 'fa-exclamation-triangle'
        iconColor = theme.palette.WARNING
        break
      case 'error':
        iconName = 'fa-exclamation-circle'
        iconColor = theme.palette.DANGER
    }

    if (!visible) return null

    return (
      <Wrapper className={`${type} ${className}`} theme={theme}>
        <Icon name={iconName} size={14} color={iconColor} />
        <Txt theme={theme}>{text}</Txt>
        <SecondaryButton className="flash_onclose" onClick={onClose} size="s" square>
          <Icon size={16} name="fa-times" />
        </SecondaryButton>
      </Wrapper>
    )
  }
}

export const Flash = withTheme(FlashComponent)

const bounceAnimation = keyframes`
  from,
  20%,
  53%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -30px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`

const Wrapper = styled.div`
  ${({ theme }: InjectedProps) => {
    const { size, frame, palette } = theme

    return css`
      z-index: 1000;
      display: flex;
      position: fixed;
      bottom: ${size.pxToRem(size.space.XXS)};
      left: ${size.pxToRem(size.space.XXS)};
      box-sizing: border-box;
      align-items: center;
      min-width: ${size.pxToRem(200)};
      padding: ${size.pxToRem(size.space.XS)};
      padding-right: ${size.pxToRem(54)};
      border: 1px solid ${palette.BORDER}
      border-radius: ${frame.border.radius.m};
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
        0 2px 1px -1px rgba(0, 0, 0, 0.12);
      box-sizing: border-box;
      animation: ${bounceAnimation} 1s 0s both;

      > .flash_onclose {
        position: absolute;
        top: 50%;
        right: ${size.pxToRem(size.space.XXS)};
        transform: translateY(-50%);
      }
    `
  }}
`
const Txt = styled.p`
  ${({ theme }: InjectedProps) => {
    const { size } = theme

    return css`
      flex: 1;
      padding: 0;
      margin: 0 0 0 ${size.pxToRem(size.space.XXS)};
      font-size: ${size.pxToRem(size.font.TALL)};
      line-height: 1;
    `
  }}
`
