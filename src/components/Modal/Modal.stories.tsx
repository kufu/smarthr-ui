import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Modal, ModalContent, ModalEraser, ModalTrigger, ModalWrapper } from './'

// prepare wrapper class
class ModalController extends React.PureComponent {
  public state = {
    isOpen: false,
  }

  public render() {
    return (
      <div>
        <button onClick={this.onClickOpen}>Controllable Modal</button>
        <Modal isOpen={this.state.isOpen}>
          <Inner>
            <button onClick={this.onClickClose}>Close Modal</button>
          </Inner>
        </Modal>
      </div>
    )
  }

  private onClickOpen = () => {
    this.setState({ isOpen: true })
  }

  private onClickClose = () => {
    this.setState({ isOpen: false })
  }
}

storiesOf('Modal', module).add('all', () => (
  <div>
    <ModalController />

    <ModalWrapper>
      <ModalTrigger>
        <button>Uncontrollable Modal</button>
      </ModalTrigger>
      <ModalContent>
        <Inner>
          <Txt>Rendered</Txt>
          <ModalEraser>
            <button>閉じる</button>
          </ModalEraser>
        </Inner>
      </ModalContent>
    </ModalWrapper>

    <ModalWrapper>
      <ModalTrigger>
        <button>
          モーダルの位置を変更することができます。
          <br />
          top: 50px, left: 200px
        </button>
      </ModalTrigger>
      <ModalContent top={50} left={200}>
        <Inner>
          <Txt>Rendered</Txt>
          <ModalEraser>
            <button>閉じる</button>
          </ModalEraser>
        </Inner>
      </ModalContent>
    </ModalWrapper>

    <ModalWrapper>
      <ModalTrigger>
        <button>right: 50px, bottom: 100px</button>
      </ModalTrigger>
      <ModalContent right={50} bottom={100}>
        <Inner>
          <Txt>Rendered</Txt>
          <ModalEraser>
            <button>閉じる</button>
          </ModalEraser>
        </Inner>
      </ModalContent>
    </ModalWrapper>
  </div>
))

const Inner = styled.div`
  padding: 2.4rem;
`
const Txt = styled.p`
  margin: 0;
`
