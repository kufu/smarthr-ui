import * as React from 'react'
import styled from 'styled-components'

import { ModalConsumer } from './Modal'

export const ModalContent: React.FC<{}> = props => (
  <ModalConsumer>
    {({ active }) => (
      <Wrapper className={active ? 'active' : ''}>
        <div>{props.children}</div>
      </Wrapper>
    )}
  </ModalConsumer>
)

const Wrapper = styled.div`
  visibility: hidden;
  opacity: 0;
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease-in-out;

  &.active {
    visibility: visible;
    opacity: 1;
  }
`
