import * as React from 'react'
import { ModalConsumer } from './Modal'

export const ModalEraser: React.FC<{}> = ({ children }) => (
  <ModalConsumer>{({ hideModal }) => <div onClick={hideModal}>{children}</div>}</ModalConsumer>
)
