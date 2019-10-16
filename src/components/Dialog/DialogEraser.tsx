import * as React from 'react'
import { DialogConsumer } from './DialogWrapper'

export const DialogEraser: React.FC<{}> = ({ children }) => (
  <DialogConsumer>{({ hideDialog }) => <div onClick={hideDialog}>{children}</div>}</DialogConsumer>
)
