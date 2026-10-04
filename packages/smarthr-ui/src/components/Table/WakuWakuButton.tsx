import { Button } from '../Button'

import type { ComponentPropsWithRef, FC } from 'react'

type Props = Omit<
  ComponentPropsWithRef<typeof Button>,
  'variant' | 'size' | 'prefix' | 'suffix' | 'disabledReason' | 'wide' | 'loading'
>

/**
 * @deprecated WakuWakuButton は非推奨です。Button[variant="tertiary"] を使ってください。
 */
export const WakuWakuButton: FC<Props> = (props) => (
  <Button {...props} variant="tertiary" size="S" className="shr-text-link-darken" />
)
