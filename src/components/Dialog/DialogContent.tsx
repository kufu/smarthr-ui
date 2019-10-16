import * as React from 'react'

import { Box } from './Box'
import { DialogConsumer } from './DialogWrapper'

interface Props {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export const DialogContent: React.FC<Props> = ({ children, ...props }) => (
  <DialogConsumer>
    {({ active, hideDialog }) => (
      <Box active={active} onClickBackground={hideDialog} {...props}>
        {children}
      </Box>
    )}
  </DialogConsumer>
)
