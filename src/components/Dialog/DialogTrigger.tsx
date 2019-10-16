import * as React from 'react'
import { DialogConsumer } from './DialogWrapper'

export const DialogTrigger: React.FC<{}> = ({ children }) => (
  <DialogConsumer>{({ showDialog }) => <div onClick={showDialog}>{children}</div>}</DialogConsumer>
)
