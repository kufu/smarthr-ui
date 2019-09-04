import * as React from 'react'
import styled, { css } from 'styled-components'
import { InjectedProps, withTheme } from '../../hocs/withTheme'

interface Props {
  children: React.ReactNode
  bordered?: boolean
  className?: string
}

type MergedProps = Props & InjectedProps

const TabBarComponent: React.FC<MergedProps> = ({ className = '', bordered = true, children }) => {
  const classNames = `${className} ${bordered ? 'bordered' : ''}`
  return (
    <Wrapper role="tablist" className={classNames}>
      {children}
    </Wrapper>
  )
}

export const TabBar = withTheme(TabBarComponent)

const Wrapper = styled.div`
  ${({ theme }: InjectedProps) => {
    const { frame } = theme
    return css`
      display: flex;

      &.bordered {
        position: relative;

        :after {
          position: absolute;
          bottom: 0px;
          width: 100%;
          border-bottom: ${frame.border.default};
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
