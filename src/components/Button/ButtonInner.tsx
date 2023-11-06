import React, { FC, PropsWithChildren } from 'react'
import { tv } from 'tailwind-variants'

export type Props = PropsWithChildren<{
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}>

const buttonInner = tv({
  base: [
    /* LineClamp を併用する場合に、幅を計算してもらうために指定 */
    'shr-min-w-0',
  ],
})

export const ButtonInner: FC<Props> = ({ prefix, suffix, ...props }) => (
  <>
    {prefix}
    <span {...props} className={buttonInner()} />
    {suffix}
  </>
)
