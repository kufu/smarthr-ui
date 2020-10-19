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
    const classNames = `${className} ${radius ? `radius-${radius}` : ''}`
    return <Wrapper className={classNames} themes={themes} ref={ref} {...props} />
  },
)

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    return css`
      box-shadow: ${themes.shadow.BASE};
      background-color: #fff;

      &.radius-s {
        border-radius: 6px;
      }
      &.radius-m {
        border-radius: 8px;
      }
    `
  }}
`
