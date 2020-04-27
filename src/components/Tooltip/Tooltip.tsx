import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { LightBalloon } from '../Balloon'
import { useTheme, Theme } from '../../hooks/useTheme'

interface Prop {
  message: React.ReactNode
  children: React.ReactNode
  triggerType?: 'icon' | 'text'
  multiLine?: boolean
  ellipsisOnly?: boolean
}

export const Tooltip: React.FC<Prop> = ({
  message,
  children,
  triggerType,
  multiLine,
  ellipsisOnly = false,
}) => {
  const theme = useTheme()
  const [isVisible, setIsVisible] = useState(false)

  const className = [triggerType === 'icon' ? 'icon-tooltip' : '', multiLine ? 'multi-line' : '']
    .filter(c => !!c)
    .join(' ')
  const ref = React.createRef<HTMLSpanElement>()

  const overAction = () => {
    if (!ellipsisOnly) {
      setIsVisible(true)

      return
    }

    const wrapper = ref.current!
    const parentWidth = parseInt(
      window.getComputedStyle(wrapper.parentNode! as HTMLElement, null).width.match(/\d+/)![0],
      10,
    )

    if (parentWidth <= wrapper.clientWidth) {
      setIsVisible(true)
    }
  }
  const outAction = () => {
    setIsVisible(false)
  }

  return (
    <Wrapper
      ref={ref}
      onMouseOver={overAction}
      onTouchStart={overAction}
      onMouseOut={outAction}
      onTouchEnd={outAction}
    >
      {isVisible && (
        <StyledBalloon horizontal="left" vertical="bottom" className={className}>
          <StyledBalloonText themes={theme}>{message}</StyledBalloonText>
        </StyledBalloon>
      )}
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.span`
  position: relative;
  display: inline-block;
  max-width: 100%;
`

const StyledBalloon = styled(LightBalloon)`
  position: absolute;
  left: 0;
  bottom: calc(100% + 10px);

  &.multi-line {
    width: 100%;
    white-space: normal;
  }

  &.icon-tooltip {
    left: calc(-100% - 5px);
  }
`

const StyledBalloonText = styled.p<{ themes: Theme }>`
  margin: 0;
  ${props => {
    const { themes } = props
    const { size } = themes

    return css`
      padding: ${size.pxToRem(size.space.XXS)} ${size.pxToRem(size.space.XS)};
    `
  }}
`
