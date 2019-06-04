import * as React from 'react'
import styled, { css, keyframes } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'
import { Icon } from '../Icon'

interface Props {
  type: 'success' | 'info' | 'alert' | 'danger' | ''
  text: string
  visible: boolean
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
    const { type, text, onClose, theme } = this.props
    const iconName = type === 'success' ? 'check-circle' : 'exclamation-triangle'

    if (!visible) return null

    return (
      <Wrapper className={type} theme={theme}>
        <Icon name={iconName} width={24} height={24} fill={theme.palette.White} />
        <Txt theme={theme}>{text}</Txt>
        <CloseButton onClick={onClose} className="close">
          <Icon name="cross" width={12} height={12} fill={theme.palette.Mono_P20} />
        </CloseButton>
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
      position: fixed;
      bottom: ${size.pxToRem(size.space.xxs)};
      left: ${size.pxToRem(size.space.xxs)};
      display: flex;
      align-items: center;
      width: 404px;
      height: 50px;
      padding: 0 ${size.pxToRem(size.space.xs)};
      border-radius: ${frame.border.radius.m};
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
        0 2px 1px -1px rgba(0, 0, 0, 0.12);
      box-sizing: border-box;
      animation: ${bounceAnimation} 1s 0s both;

      &.success {
        background-color: ${palette.Main};
      }

      &.danger {
        background-color: ${palette.Red};
      }
    `
  }}
`
const Txt = styled.p`
  ${({ theme }: InjectedProps) => {
    const { size, palette } = theme

    return css`
      flex: 1;
      padding: 0 ${size.pxToRem(size.space.xs)};
      color: ${palette.White};
      font-size: ${size.pxToRem(size.font.tall)};
    `
  }}
`
const CloseButton = styled.button`
  width: 12px;
  height: 12px;
  padding: 0;
  border: 0;
  background-color: transparent;
  cursor: pointer;
`
