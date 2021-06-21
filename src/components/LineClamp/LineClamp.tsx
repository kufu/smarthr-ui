import React, { HTMLAttributes, ReactNode, VFC, useRef, useState } from 'react'
import styled from 'styled-components'
import { LightTooltip } from '../Tooltip'
import { useClassNames } from './useClassNames'

type Props = {
  maxLines?: number
  withTooltip?: boolean
  children: ReactNode
}
type ElementProps = Omit<HTMLAttributes<HTMLSpanElement>, keyof Props>

export const LineClamp: VFC<Props & ElementProps> = ({
  maxLines = 3,
  withTooltip = false,
  children,
  className = '',
  ...props
}) => {
  const classNames = useClassNames()
  const [isTooltipVisible, setTooltipVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const isMultiLineOverflow = () => {
    const el = ref.current
    return el ? el.scrollHeight > el.clientHeight : false
  }

  const overAction = () => {
    setTooltipVisible(isMultiLineOverflow())
  }

  const LineClampPart = () => (
    <Wrapper
      {...props}
      ref={ref}
      maxLines={maxLines}
      className={`${className} ${classNames.wrapper}`}
      onMouseEnter={overAction}
    >
      {children}
    </Wrapper>
  )

  return withTooltip && isTooltipVisible ? (
    <LightTooltip message={children} multiLine>
      <LineClampPart />
    </LightTooltip>
  ) : (
    <LineClampPart />
  )
}

const Wrapper = styled.span<{ maxLines: number }>`
  /* stylelint-disable */
  display: box;
  display: -webkit-box;
  display: -moz-box;
  box-orient: vertical;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  line-clamp: ${({ maxLines }) => maxLines};
  -webkit-line-clamp: ${({ maxLines }) => maxLines};
  /* stylelint-enable */
  overflow-y: hidden;
  word-break: break-word;
`
