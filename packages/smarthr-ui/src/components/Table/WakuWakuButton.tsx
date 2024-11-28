import React from 'react'

import { Button } from '../Button'

type Props = Omit<
  React.ComponentProps<typeof Button>,
  'variant' | 'size' | 'prefix' | 'suffix' | 'disabledDetail' | 'wide' | 'square' | 'loading'
>

export const WakuWakuButton: React.FC<Props> = (props) => (
  <Button {...props} variant="text" size="s" className="shr-text-link-darken" />
)
