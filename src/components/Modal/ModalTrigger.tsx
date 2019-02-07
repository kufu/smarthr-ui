import * as React from 'react'
import { ModalConsumer } from './Modal'

export const ModalTrigger: React.FC<{}> = ({ children }) => (
  <ModalConsumer>{({ showModal }) => <div onClick={showModal}>{children}</div>}</ModalConsumer>
)
