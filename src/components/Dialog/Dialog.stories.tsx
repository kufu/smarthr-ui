import { storiesOf } from '@storybook/react'
import * as React from 'react'
import styled from 'styled-components'

import { Dialog, DialogContent, DialogEraser, DialogTrigger, DialogWrapper } from './'

// prepare wrapper class
class DialogController extends React.PureComponent {
  public state = {
    isOpen: false,
  }

  public render() {
    return (
      <div>
        <button onClick={this.onClickOpen}>Controllable Dialog</button>
        <Dialog isOpen={this.state.isOpen} onClickBackground={this.onClickClose}>
          <Inner>
            <button onClick={this.onClickClose}>Close Dialog</button>
          </Inner>
        </Dialog>
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
    <DialogController />

    <DialogWrapper>
      <DialogTrigger>
        <button>Uncontrollable Dialog</button>
      </DialogTrigger>
      <DialogContent>
        <Inner>
          <Txt>Rendered</Txt>
          <DialogEraser>
            <button>閉じる</button>
          </DialogEraser>
        </Inner>
      </DialogContent>
    </DialogWrapper>

    <DialogWrapper>
      <DialogTrigger>
        <button>
          Change the position of the Dialog.
          <br />
          top: 50px, left: 200px
        </button>
      </DialogTrigger>
      <DialogContent top={50} left={200}>
        <Inner>
          <Txt>Rendered</Txt>
          <DialogEraser>
            <button>閉じる</button>
          </DialogEraser>
        </Inner>
      </DialogContent>
    </DialogWrapper>

    <DialogWrapper>
      <DialogTrigger>
        <button>right: 50px, bottom: 100px</button>
      </DialogTrigger>
      <DialogContent right={50} bottom={100}>
        <Inner>
          <Txt>Rendered</Txt>
          <DialogEraser>
            <button>閉じる</button>
          </DialogEraser>
        </Inner>
      </DialogContent>
    </DialogWrapper>

    <DialogWrapper>
      <DialogTrigger>
        <button>right: 0px, bottom: 0px</button>
      </DialogTrigger>
      <DialogContent right={0} bottom={0}>
        <Inner>
          <Txt>Rendered</Txt>
          <DialogEraser>
            <button>閉じる</button>
          </DialogEraser>
        </Inner>
      </DialogContent>
    </DialogWrapper>

    <DialogWrapper>
      <DialogTrigger>
        <button>autoFocus</button>
      </DialogTrigger>
      <DialogContent>
        <Inner>
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input type="text" autoFocus />
          <DialogEraser>
            <button>閉じる</button>
          </DialogEraser>
        </Inner>
      </DialogContent>
    </DialogWrapper>
  </React.Fragment>
)

storiesOf('Dialog', module)
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
