import { Button } from '../Button'

import type { ComponentProps, FC } from 'react'

type Props = Omit<
  ComponentProps<typeof Button>,
  'variant' | 'size' | 'prefix' | 'suffix' | 'disabledDetail' | 'wide' | 'loading'
>

export const WakuWakuButton: FC<Props> = (props) => (
  <Button {...props} variant="tertiary" size="s" className="shr-text-link-darken" />
)
