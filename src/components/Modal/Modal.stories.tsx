import * as React from 'react'
import styled from 'styled-components'
import { storiesOf } from '@storybook/react'

import { Modal, ModalTrigger, ModalEraser, ModalContent } from './'

storiesOf('Modal', module).add('all', () => (
  <div>
    <Modal modalKey="test-modal-1">
      <ModalTrigger>
        <Txt>Click me (Modal1)</Txt>
      </ModalTrigger>
      <ModalContent>
        <Inner>
          Modal1 Rendered!
          <br />
          <ModalEraser>閉じる</ModalEraser>
        </Inner>
      </ModalContent>
    </Modal>

    <Modal modalKey="test-modal-2">
      <ModalTrigger>
        <Txt>Click me (Modal2)</Txt>
      </ModalTrigger>
      <ModalContent>
        <Inner>
          Modal2 Rendered!
          <br />
          <ModalEraser>閉じる</ModalEraser>
        </Inner>
      </ModalContent>
    </Modal>
  </div>
))

const Txt = styled.p`
  margin: 0;
  padding: 5px 10px;
  font-size: 16px;
`
const Inner = styled.p`
  margin: 0;
  padding: 20px;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
`
