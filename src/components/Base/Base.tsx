import React, { ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  children: ReactNode
  radius?: 's' | 'm'
  className?: string
}

const radiusMap = {
  s: '6px',
  m: '8px',
}

export const Base = forwardRef<HTMLDivElement, Props>(
  ({ radius = 'm', className = '', ...props }, ref) => {
    const themes = useTheme()
    const classNames = useClassNames()

    return (
      <Wrapper
        {...props}
        className={`${className} ${classNames.wrapper}`}
        themes={themes}
        $radius={radiusMap[radius]}
        ref={ref}
      />
    )
  },
)

const Wrapper = styled.div<{ themes: Theme; $radius: string }>`
  ${({ themes, $radius }) => {
    return css`
      box-shadow: ${themes.shadow.BASE};
      border-radius: ${$radius};
      background-color: #fff;
    `
  }}
`
