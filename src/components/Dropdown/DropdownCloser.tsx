import React, { HTMLAttributes, useContext } from 'react'
import styled, { css } from 'styled-components'

import { DropdownContentContext } from './DropdownContent'
import { DropdownContentInnerContext } from './DropdownContentInner'
import { useClassNames } from './useClassNames'

type Props = {
  children: React.ReactNode
} & HTMLAttributes<HTMLDivElement>

export const DropdownCloser: React.VFC<Props> = ({ children, className = '' }) => {
  const { onClickCloser, controllable, scrollable } = useContext(DropdownContentContext)
  const { maxHeight } = useContext(DropdownContentInnerContext)
  const classNames = useClassNames()

  return (
    <Wrapper
      className={`${className} ${classNames.closer}`}
      onClick={onClickCloser}
      maxHeight={maxHeight}
      controllable={controllable}
      scrollable={scrollable}
    >
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ maxHeight: string; controllable: boolean; scrollable: boolean }>`
  ${({ maxHeight, controllable, scrollable }) => css`
      ${!controllable
        ? `
      display: flex;
      flex-direction: column;
      `
        : ''}
      ${!controllable && scrollable ? `max-height: ${maxHeight};` : ''}
    `}
`
