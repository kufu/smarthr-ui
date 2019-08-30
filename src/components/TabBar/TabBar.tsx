import * as React from 'react'
import styled, { css } from 'styled-components'

import { InjectedProps, withTheme } from '../../hocs/withTheme'

interface Props {
  children: React.ReactNode
  bordered?: boolean
  className?: string
}

type MergedProps = Props & InjectedProps

const TabBarComponent: React.FC<MergedProps> = ({
  className = '',
  bordered = true,
  children,
  ...props
}) => {
  const classNames = `${className} ${bordered ? 'bordered' : ''}`
  return (
    <Wrapper role="tablist" className={classNames} {...props}>
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
      padding-bottom: 1px;

      &.bordered {
        border-bottom: ${frame.border.default};
        padding-bottom: 0;
      }
    `
  }}
`
