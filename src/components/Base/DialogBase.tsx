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

export const DialogBase = forwardRef<HTMLDivElement, Props & ElementProps>(
  ({ radius = 'm', className = '', ...props }, ref) => {
    const themes = useTheme()
    const classNames = useClassNames()

    return (
      <Wrapper
        className={`${className} ${classNames.dialogBase.wrapper}`}
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
      box-shadow: ${themes.shadow.DIALOG};
      border-radius: ${$radius};
      background-color: #fff;
    `
  }}
`
