import React from 'react'

import { Button } from '../Button'

type Props = Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'>

export const WakuWakuButton: React.FC<Props> = (props) => (
  <Button {...props} variant="text" size="s" className="shr-text-link-darken" />
)
