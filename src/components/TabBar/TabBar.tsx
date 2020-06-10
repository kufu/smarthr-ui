import React, { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'

type Props = {
  children: ReactNode
  bordered?: boolean
  className?: string
}

export const TabBar: FC<Props> = ({ className = '', bordered = true, children }) => {
  const theme = useTheme()
  const classNames = `${className} ${bordered ? 'bordered' : ''}`

  return (
    <Wrapper role="tablist" className={classNames} themes={theme}>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ themes: Theme }>`
  ${({ themes }) => {
    const { border } = themes.frame

    return css`
      display: flex;

      &.bordered {
        position: relative;

        :after {
          position: absolute;
          bottom: 0px;
          width: 100%;
          border-bottom: ${border.default};
          content: '';
        }

        > button {
          &.selected {
            position: relative;
            z-index: 1;
          }
        }
      }
    `
  }}
`
