import React, { ReactNode } from 'react'
import styled from 'styled-components'

type Props = {
  className?: string
  children: ReactNode
}

export const DropdownScrollArea: React.VFC<Props> = ({ children, className = '' }) => (
  <Wrapper className={className}>{children}</Wrapper>
)

const Wrapper = styled.div`
  overflow-y: auto;
  flex: 1 1 auto;

  /* IE11 */
  /* stylelint-disable-next-line selector-type-no-unknown */
  _:-ms-lang(x)::-ms-backdrop,
  & {
    max-height: 300px;
  }
`
