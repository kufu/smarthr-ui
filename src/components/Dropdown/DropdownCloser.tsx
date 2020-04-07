import React, { useContext } from 'react'
import styled, { css } from 'styled-components'

import { DropdownContext } from './Dropdown'
import { DropdownContentContext } from './DropdownContent'
import { DropdownContentInnerContext } from './DropdownContentInner'

type Props = {
  children: React.ReactNode
  className?: string
}

export const DropdownCloser: React.FC<Props> = ({ children, className = '' }) => {
  const { dropdownKey } = useContext(DropdownContext)
  const { onClickCloser, controllable, scrollable } = useContext(DropdownContentContext)
  const { maxHeight } = useContext(DropdownContentInnerContext)

  return (
    <Wrapper
      className={`${dropdownKey} ${className} close`}
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
  ${({ maxHeight, controllable, scrollable }) => {
    return css`
      ${!controllable
        ? `
      display: flex;
      flex-direction: column;
      `
        : ''}
      ${!controllable && scrollable ? `max-height: ${maxHeight};` : ''}
    `
  }}
`
