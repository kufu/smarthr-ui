// controllable Dialog
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

export const Dialog: React.FC<Props> = ({ isOpen, ...props }) => <Box active={isOpen} {...props} />
