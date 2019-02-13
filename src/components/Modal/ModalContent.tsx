import * as React from 'react'

import { Box } from './Box'
import { ModalConsumer } from './ModalWrapper'

interface Props {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export const ModalContent: React.FC<Props> = ({ children, ...props }) => (
  <ModalConsumer>
    {({ active }) => (
      <Box active={active} {...props}>
        {children}
      </Box>
    )}
  </ModalConsumer>
)
