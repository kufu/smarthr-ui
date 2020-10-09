import React, { ReactNode, forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  children: ReactNode
  radius?: 's' | 'm'
  className?: string
}

export const Base = forwardRef<HTMLDivElement, Props>(({ radius = 'm', ...props }, ref) => {
  const themes = useTheme()
  const radiusMap = {
    s: '6px',
    m: '8px',
  }
  return <Wrapper themes={themes} radius={radiusMap[radius]} ref={ref} {...props} />
})

const Wrapper = styled.div<{ themes: Theme; radius: string }>`
  ${({ themes, radius }) => {
    const { shadow } = themes

    return css`
      border-radius: ${radius};
      box-shadow: ${shadow.BASE};
      background-color: #fff;
    `
  }}
`
