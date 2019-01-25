import * as React from 'react'
import styled from 'styled-components'

import { ModalEraser } from './ModalEraser'

interface Props {
  active?: boolean
  onClick?: () => void
}

export class ModalContent extends React.PureComponent<Props> {
  public static displayName = 'ModalContent'
  private erasers: Element[] = []

  public componentDidMount() {
    this.erasers = Array.from(document.getElementsByClassName(ModalEraser.displayName || ''))
    this.erasers.forEach(eraser => {
      eraser.addEventListener('click', this.props.onClick as any)
    })
  }

  public componentWillUnmount() {
    this.erasers.forEach(eraser => {
      eraser.removeEventListener('click', this.props.onClick as any)
    })
  }

  public render() {
    const { active, children } = this.props

    return (
      <Wrapper className={`ModalContent ${active ? 'active' : ''}`}>
        <div>{children}</div>
      </Wrapper>
    )
  }
}

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
