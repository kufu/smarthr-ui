import React, { HTMLAttributes, ReactNode, VFC, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { BalloonTheme } from '../Balloon'
import { DarkTooltip, LightTooltip } from '../Tooltip'
import { useClassNames } from './useClassNames'

type Props = {
  maxLines?: number
  withTooltip?: boolean
  toolTipType?: BalloonTheme
  children: ReactNode
}
type ElementProps = Omit<HTMLAttributes<HTMLSpanElement>, keyof Props>

export const LineClamp: VFC<Props & ElementProps> = ({
  maxLines = 3,
  withTooltip = false,
  toolTipType = 'light',
  children,
  className = '',
  ...props
}) => {
  const classNames = useClassNames()
  const [isTooltipVisible, setTooltipVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const isMultiLineOverflow = () => {
    const el = ref.current
    return el ? el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight : false
  }

  useEffect(() => {
    setTooltipVisible(withTooltip && isMultiLineOverflow())
  }, [maxLines, withTooltip, children])

  if (maxLines < 1) {
    throw new Error('"maxLines" cannot be less than 0.')
  }

  const LineClampPart = () => (
    <Wrapper
      {...props}
      ref={ref}
      maxLines={maxLines}
      className={`${className} ${classNames.wrapper}`}
    >
      {children}
    </Wrapper>
  )

  const Tooltip = () =>
    toolTipType === 'light' ? (
      <LightTooltip message={children} multiLine>
        <LineClampPart />
      </LightTooltip>
    ) : (
      <DarkTooltip message={children} multiLine>
        <LineClampPart />
      </DarkTooltip>
    )

  return isTooltipVisible ? <Tooltip /> : <LineClampPart />
}

const Wrapper = styled.span<{ maxLines: number }>`
  word-break: break-word;
  ${({ maxLines }) =>
    maxLines === 1
      ? css`
          display: inline-block;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: middle;
        `
      : css`
          /* stylelint-disable */
          display: box;
          display: -webkit-box;
          display: -moz-box;
          box-orient: vertical;
          -webkit-box-orient: vertical;
          -moz-box-orient: vertical;
          line-clamp: ${maxLines};
          -webkit-line-clamp: ${maxLines};
          /* stylelint-enable */
          overflow-y: hidden;
        `}
`
