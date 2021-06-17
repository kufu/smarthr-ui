import React, { ReactNode, VFC } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  children: ReactNode
  bordered?: boolean
  className?: string
}

export const TabBar: VFC<Props> = ({ className = '', bordered = true, children }) => {
  const theme = useTheme()
  const classNames = useClassNames().tabBar
  const wrapperClass = `${className} ${bordered ? 'bordered' : ''} ${classNames.wrapper}`

  return (
    <Wrapper role="tablist" className={wrapperClass} themes={theme}>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { frame } = themes

    return css`
      display: flex;

      &.bordered {
        position: relative;

        ::before {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border-bottom: ${frame.border.default};
          content: '';
        }
      }
    `
  }}
`
