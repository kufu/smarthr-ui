import React, { ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  children: ReactNode
  radius?: 's' | 'm'
  className?: string
}

export const Base = forwardRef<HTMLDivElement, Props>(
  ({ radius = 'm', className = '', ...props }, ref) => {
    const themes = useTheme()
    const radiusMap = {
      s: '6px',
      m: '8px',
    }
    return (
      <Wrapper
        className={className}
        themes={themes}
        $radius={radiusMap[radius]}
        ref={ref}
        {...props}
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
