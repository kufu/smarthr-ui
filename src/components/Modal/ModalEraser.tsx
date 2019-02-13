import * as React from 'react'
import { ModalConsumer } from './ModalWrapper'

export const ModalEraser: React.FC<{}> = ({ children }) => (
  <ModalConsumer>{({ hideModal }) => <div onClick={hideModal}>{children}</div>}</ModalConsumer>
)
