import React, { FC } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { VISUALLY_HIDDEN_STYLE } from '../../constants'
import {
  cogDuration,
  containerRotate,
  fillUnfillRotate,
  leftSpin,
  line1FadeInOut,
  line2FadeInOut,
  line3FadeInOut,
  line4FadeInOut,
  lineDuration,
  rightSpin,
  spinnerEasing,
} from './loaderAnimation'

type Props = {
  color?: string
  size?: 's' | 'm'
  className?: string
  text?: string
}

export const Loader: FC<Props> = ({ color = '#fff', size = 'm', className = '', text = '' }) => {
  const theme = useTheme()

  return (
    <Wrapper className={className} role="status">
      <Spinner className={size}>
        {[...Array(4)].map((_, index) => (
          <Line className={`line${index + 1}`} $color={color} key={index}>
            <Cog>
              <CogInner className="cogInner left"></CogInner>
            </Cog>
            <Ticker>
              <CogInner className="cogInner center"></CogInner>
            </Ticker>
            <Cog>
              <CogInner className="cogInner right"></CogInner>
            </Cog>
          </Line>
        ))}
      </Spinner>
      <Text themes={theme}>{text}</Text>
      <VisuallyHidden>Loading</VisuallyHidden>
    </Wrapper>
  )
}

const Wrapper = styled.div``

const VisuallyHidden = styled.span`
  ${VISUALLY_HIDDEN_STYLE}
`

const Spinner = styled.div`
  position: relative;
  animation: ${containerRotate} 1600ms linear infinite;
  margin: 0 auto;

  &.m {
    width: 48px;
    height: 48px;

    .cogInner {
      border-width: 4px;
    }
  }
  &.s {
    width: 24px;
    height: 24px;

    .cogInner {
      border-width: 2px;
    }
  }
`

const Line = styled.div`
  ${({ $color }: { $color: string }) => css`
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    border-color: ${$color};

    &.line1 {
      /* stylelint-disable */
      animation: ${fillUnfillRotate} ${lineDuration} ${spinnerEasing} infinite both,
        ${line1FadeInOut} ${lineDuration} ${spinnerEasing} infinite both;
    }
    &.line2 {
      animation: ${fillUnfillRotate} ${lineDuration} ${spinnerEasing} infinite both,
        ${line2FadeInOut} ${lineDuration} ${spinnerEasing} infinite both;
    }
    &.line3 {
      animation: ${fillUnfillRotate} ${lineDuration} ${spinnerEasing} infinite both,
        ${line3FadeInOut} ${lineDuration} ${spinnerEasing} infinite both;
    }
    &.line4 {
      animation: ${fillUnfillRotate} ${lineDuration} ${spinnerEasing} infinite both,
        ${line4FadeInOut} ${lineDuration} ${spinnerEasing} infinite both;
    }
    /* stylelint-enable */
  `}
`

const Cog = styled.div`
  display: inline-block;
  position: relative;
  width: 50%;
  height: 100%;
  overflow: hidden;
  border-color: inherit;
`

const CogInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  box-sizing: border-box;
  height: 100%;
  border-style: solid;
  border-color: inherit;
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: none;

  &.left {
    border-right-color: transparent;
    transform: rotate(129deg);
    animation: ${leftSpin} ${cogDuration} ${spinnerEasing} infinite both;
  }
  &.center {
    width: 1000%;
    left: -450%;
  }
  &.right {
    left: -100%;
    border-left-color: transparent;
    transform: rotate(-129deg);
    animation: ${rightSpin} ${cogDuration} ${spinnerEasing} infinite both;
  }
`

const Ticker = styled.div`
  position: absolute;
  box-sizing: border-box;
  top: 0;
  left: 45%;
  width: 10%;
  height: 100%;
  overflow: hidden;
  border-color: inherit;
`

const Text = styled.p<{ themes: Theme }>`
  ${({ themes }) => {
    const { palette, size } = themes

    return css`
      color: ${palette.TEXT_BLACK};
      margin-top: ${size.pxToRem(size.space.XS)};
      font-size: ${size.pxToRem(size.font.TALL)};
    `
  }}
`
