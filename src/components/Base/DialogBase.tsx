import React, { HTMLAttributes, ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

import { useClassNames } from './useClassNames'

type Props = {
  children: ReactNode
  radius?: 's' | 'm'
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

const radiusMap = {
  s: '6px',
  m: '8px',
}

/**
 * @deprecated The DialogBase component is deprecated, so use Base component instead.
 */
export const DialogBase = forwardRef<HTMLDivElement, Props & ElementProps>(
  ({ radius = 'm', className = '', ...props }, ref) => {
    const themes = useTheme()
    const classNames = useClassNames()

    return (
      <Wrapper
        {...props}
        className={`${className} ${classNames.dialogBase.wrapper}`}
        themes={themes}
        $radius={radiusMap[radius]}
        ref={ref}
      />
    )
  },
)

const Wrapper = styled.div<{ themes: Theme; $radius: string }>`
  ${({ themes: { color, shadow }, $radius }) => css`
      box-shadow: ${shadow.LAYER3};
      border-radius: ${$radius};
      background-color: ${color.WHITE};
    `}
`
