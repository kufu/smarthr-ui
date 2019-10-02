// controllable modal
import * as React from 'react'

import { Box } from './Box'

interface Props {
  isOpen: boolean
  onClickBackground?: () => void
  top?: number
  right?: number
  bottom?: number
  left?: number
}

export const Modal: React.FC<Props> = ({ isOpen, ...props }) => <Box active={isOpen} {...props} />
