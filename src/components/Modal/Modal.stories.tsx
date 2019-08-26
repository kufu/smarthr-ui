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
        <Modal isOpen={this.state.isOpen} onClickBackground={this.onClickClose}>
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

const StoryComponents = () => (
  <React.Fragment>
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
          Change the position of the modal.
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

    <ModalWrapper>
      <ModalTrigger>
        <button>right: 0px, bottom: 0px</button>
      </ModalTrigger>
      <ModalContent right={0} bottom={0}>
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
        <button>autoFocus</button>
      </ModalTrigger>
      <ModalContent>
        <Inner>
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input type="text" autoFocus />
          <ModalEraser>
            <button>閉じる</button>
          </ModalEraser>
        </Inner>
      </ModalContent>
    </ModalWrapper>
  </React.Fragment>
)

storiesOf('Modal', module)
  .add('all', () => <StoryComponents />)
  .add('Suppresses scrolling', () => (
    <Wrapper>
      <ScrollBox>
        <ScrollChunk>0px</ScrollChunk>
        <ScrollChunk>200px</ScrollChunk>
        <ScrollChunk>400px</ScrollChunk>
        <ScrollChunk>600px</ScrollChunk>
        <ScrollChunk>800px</ScrollChunk>
        <ScrollChunk>1000px</ScrollChunk>
        <ScrollChunk>1200px</ScrollChunk>
        <ScrollChunk>1400px</ScrollChunk>
        <ScrollChunk>1600px</ScrollChunk>
        <ScrollChunk>1800px</ScrollChunk>
        <ScrollChunk>2000px</ScrollChunk>
      </ScrollBox>
      <div>
        <ButtonWrap>
          <StoryComponents />
        </ButtonWrap>
      </div>
    </Wrapper>
  ))

const Inner = styled.div`
  padding: 2.4rem;
`
const Txt = styled.p`
  margin: 0;
`
const Wrapper = styled.div`
  display: flex;
`
const ScrollBox = styled.div`
  width: 300px;
`
const ScrollChunk = styled.div`
  height: 200px;
`
const ButtonWrap = styled.div`
  position: fixed;
  top: 0;
`
