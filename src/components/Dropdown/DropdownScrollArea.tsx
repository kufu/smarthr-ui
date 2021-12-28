import React, { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'
import { useClassNames } from './useClassNames'

type Props = {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export const DropdownScrollArea: React.VFC<Props> = ({ children, className = '', ...props }) => {
  const classNames = useClassNames()

  return (
    <Wrapper className={`${className} ${classNames.scrollArea}`} {...props}>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  overflow-y: auto;
  flex: 1 1 auto;
`
